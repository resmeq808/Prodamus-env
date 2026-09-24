#!/usr/bin/env python3
"""Приёмка и обработка сгенерированных изображений в единую серию.

Кадрирует под формат слота с точкой фокуса, уменьшает, приводит к общей
обработке, добавляет единое зерно и сохраняет WebP / JPEG / PNG. Умеет
собирать контактный лист для выбора и проверять цвет фона объекта-выреза.
Нужен только Pillow.

Примеры:
  intake.py hero.png --aspect 16:9 --width 2400 --grade night --grain .08 --out site/img/hero.webp
  intake.py card.png --aspect 3:4 --width 1200 --grade bw --focus .5,.35 --out site/img/card-1.webp
  intake.py raw/*.png --aspect 3:4 --width 1200 --grade night --out site/img/      # пакетно в папку
  intake.py raw/*.png --sheet raw/sheet.jpg                                         # контактный лист
  intake.py stone.png --aspect 1:1 --width 1200 --grade none --check-bg '#0b0b0c' --out img/stone.webp
  intake.py hero.png --trim .03 --aspect 16:9 --out hero.webp                       # срезать край со значком
"""
import argparse
import glob
import math
import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFont, ImageOps

# Обработки: насыщенность, контраст, гамма (>1 темнее), подъём чёрного,
# цвет теней, цвет светов, сила тонирования (0..1).
GRADES = {
    "none": None,
    "night": dict(sat=.82, con=1.08, gamma=1.08, lift=0, shadow=(20, 58, 60), high=(255, 176, 96), tone=.28),
    "bw": dict(sat=0, con=1.12, gamma=1.02, lift=4, shadow=None, high=None, tone=0),
    "warm": dict(sat=.94, con=1.04, gamma=1.0, lift=4, shadow=(70, 44, 30), high=(255, 196, 140), tone=.22),
    "cool": dict(sat=.88, con=1.05, gamma=1.02, lift=3, shadow=(26, 44, 78), high=(222, 232, 244), tone=.22),
    "day": dict(sat=.9, con=.95, gamma=.97, lift=12, shadow=(70, 76, 66), high=(250, 244, 232), tone=.15),
}


def parse_aspect(s):
    if not s:
        return None
    a, b = s.replace("x", ":").split(":")
    return float(a) / float(b)


def parse_hex(s):
    s = s.lstrip("#")
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def trim(im, frac):
    if frac <= 0:
        return im
    w, h = im.size
    dx, dy = round(w * frac), round(h * frac)
    return im.crop((dx, dy, w - dx, h - dy))


def crop_to(im, ratio, fx=.5, fy=.5):
    w, h = im.size
    if not ratio or abs(w / h - ratio) < 1e-3:
        return im
    if w / h > ratio:
        nw = round(h * ratio)
        left = min(max(round(fx * w - nw / 2), 0), w - nw)
        return im.crop((left, 0, left + nw, h))
    nh = round(w / ratio)
    top = min(max(round(fy * h - nh / 2), 0), h - nh)
    return im.crop((0, top, w, top + nh))


def tone(im, color, strength, shadows):
    """Мягко тонирует тени или света цветом по маске яркости."""
    if not color or strength <= 0:
        return im
    lum = im.convert("L")
    if shadows:
        mask = lum.point(lambda v: round(255 * strength * max(0, 1 - v / 160) ** 1.4))
    else:
        mask = lum.point(lambda v: round(255 * strength * max(0, (v - 110) / 145) ** 1.4))
    tinted = ImageChops.soft_light(im, Image.new("RGB", im.size, color))
    return Image.composite(tinted, im, mask)


def grade(im, name):
    g = GRADES[name]
    if not g:
        return im
    if g["sat"] == 0:
        im = ImageOps.grayscale(im).convert("RGB")
    else:
        im = ImageEnhance.Color(im).enhance(g["sat"])
    im = ImageEnhance.Contrast(im).enhance(g["con"])
    gamma, lift = g["gamma"], g["lift"]
    lut = [round(lift + (255 - lift) * (i / 255) ** gamma) for i in range(256)]
    im = im.point(lut * 3)
    im = tone(im, g["shadow"], g["tone"], True)
    im = tone(im, g["high"], g["tone"], False)
    return im


def grain(im, amount):
    """Плёночное зерно: монохромный шум, наложенный режимом overlay."""
    if amount <= 0:
        return im
    w, h = im.size
    # Шум чуть крупнее пикселя — выглядит как плёнка, а не как цифровой шум.
    sw, sh = max(1, round(w / 1.4)), max(1, round(h / 1.4))
    noise = Image.effect_noise((sw, sh), 64).resize((w, h), Image.BILINEAR).convert("RGB")
    grey = Image.new("RGB", (w, h), (128, 128, 128))
    noise = Image.blend(grey, noise, min(1.0, amount * 2.2))
    return ImageChops.overlay(im, noise)


def save(im, path, quality):
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    ext = os.path.splitext(path)[1].lower()
    if ext == ".webp":
        im.save(path, "WEBP", quality=quality, method=6)
    elif ext in (".jpg", ".jpeg"):
        im.save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    elif ext == ".png":
        im.save(path, "PNG", optimize=True)
    else:
        sys.exit(f"Неизвестный формат вывода: {path} (нужен .webp, .jpg или .png)")


def corner_color(im, frac=.04):
    """Средний цвет четырёх углов — фон объекта-выреза."""
    w, h = im.size
    s = max(4, round(min(w, h) * frac))
    boxes = [(0, 0, s, s), (w - s, 0, w, s), (0, h - s, s, h), (w - s, h - s, w, h)]
    px = [im.crop(b).resize((1, 1), Image.BOX).getpixel((0, 0)) for b in boxes]
    return tuple(round(sum(p[i] for p in px) / 4) for i in range(3)), px


def load(path):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (0, 0, 0))
        bg.paste(im, mask=im.split()[-1])
        return bg
    return im.convert("RGB")


def contact_sheet(paths, out, cols=None, cell=420):
    ims = [(p, load(p)) for p in paths]
    thumbs = []
    for _, im in ims:
        t = im.copy()
        t.thumbnail((cell, cell))
        thumbs.append(t)
    n = len(ims)
    cols = cols or min(4, n)
    rows = math.ceil(n / cols)
    pad, label = 16, 34
    ch = max(t.height for t in thumbs)
    sheet = Image.new("RGB", (cols * (cell + pad) + pad, rows * (ch + label + pad) + pad), (18, 18, 20))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 15)
    except OSError:
        font = ImageFont.load_default()
    for i, ((p, im), t) in enumerate(zip(ims, thumbs)):
        r, c = divmod(i, cols)
        x, y = pad + c * (cell + pad), pad + r * (ch + label + pad)
        sheet.paste(t, (x + (cell - t.width) // 2, y + (ch - t.height) // 2))
        name = os.path.basename(p)
        draw.text((x, y + ch + 8), f"{i + 1}. {name}  {im.width}×{im.height}", fill=(200, 200, 200), font=font)
    save(sheet, out, 88)
    print(f"контактный лист: {out}  ({n} изображений)")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("inputs", nargs="+", help="файлы или маски (*.png)")
    ap.add_argument("--aspect", help="формат слота, например 16:9, 3:4, 1200:630")
    ap.add_argument("--focus", default=".5,.5", help="точка фокуса для кадрирования x,y в долях (по умолчанию .5,.5)")
    ap.add_argument("--width", type=int, help="итоговая ширина в пикселях (только уменьшение)")
    ap.add_argument("--grade", default="none", choices=GRADES, help="общая обработка серии")
    ap.add_argument("--grain", type=float, default=0, help="сила зерна 0..0.3 (обычно .06–.12)")
    ap.add_argument("--trim", type=float, default=0, help="срезать долю с каждого края до кадрирования (значок в углу)")
    ap.add_argument("--quality", type=int, default=82, help="качество WebP/JPEG")
    ap.add_argument("--out", help="файл (для одного входа) или папка (для нескольких)")
    ap.add_argument("--sheet", help="собрать контактный лист в этот файл вместо обработки")
    ap.add_argument("--check-bg", help="ожидаемый цвет фона объекта-выреза, например '#0b0b0c'")
    a = ap.parse_args()

    paths = []
    for p in a.inputs:
        found = sorted(glob.glob(p))
        paths += found if found else [p]
    missing = [p for p in paths if not os.path.isfile(p)]
    if missing:
        sys.exit("нет файлов: " + ", ".join(missing))

    if a.sheet:
        contact_sheet(paths, a.sheet)
        return

    if not a.out:
        sys.exit("нужен --out (файл или папка) или --sheet")
    many = len(paths) > 1 or a.out.endswith("/") or os.path.isdir(a.out)
    ratio = parse_aspect(a.aspect)
    fx, fy = (float(v) for v in a.focus.split(","))

    for p in paths:
        im = load(p)
        src = im.size
        im = trim(im, a.trim)
        im = crop_to(im, ratio, fx, fy)
        if a.width and im.width > a.width:
            im = im.resize((a.width, round(im.height * a.width / im.width)), Image.LANCZOS)
        im = grade(im, a.grade)
        im = grain(im, a.grain)
        out = os.path.join(a.out, os.path.splitext(os.path.basename(p))[0] + ".webp") if many else a.out
        save(im, out, a.quality)
        kb = os.path.getsize(out) / 1024
        note = ""
        if a.width and im.width < a.width * .9:
            note = f"  ! после кадрирования {im.width}px — меньше нужных {a.width}px, увеличьте разрешение генерации"
        print(f"{p} {src[0]}×{src[1]} → {out} {im.width}×{im.height} {kb:.0f} КБ{note}")
        if a.check_bg:
            want = parse_hex(a.check_bg)
            got, corners = corner_color(im)
            delta = max(abs(g - w) for g, w in zip(got, want))
            spread = max(max(c[i] for c in corners) - min(c[i] for c in corners) for i in range(3))
            verdict = "ок" if delta <= 3 and spread <= 4 else "НЕ совпадает — будет видна «коробка»"
            print(f"  фон углов #{''.join(f'{v:02x}' for v in got)} vs {a.check_bg}: Δ{delta}, разброс {spread} — {verdict}")


if __name__ == "__main__":
    main()
