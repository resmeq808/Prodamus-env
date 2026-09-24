#!/usr/bin/env python3
"""Мудборд из доски Pinterest: скачивает пины и собирает листы для просмотра.

  python3 moodboard.py https://pin.it/XXXX -o ./moodboard
  python3 moodboard.py https://ru.pinterest.com/user/board-slug/ -o ./moodboard

Без входа Pinterest отдаёт примерно 50 последних пинов (виджет-API) плюс
первые пины со страницы доски. Для полной доски попросите пользователя
выгрузить её или прислать скриншоты.

Результат:
  img/<id>.jpg      пины 736px
  sheet-NN.jpg      листы по 6 пинов в полную высоту (обзор композиции)
  heroes-NN.jpg     первые экраны крупно, по 2 пина (разбор деталей)
  pins.json         источник, описание, ссылка

Картинки — чужие работы: только для локального разбора, не коммитить
в публичный репозиторий.
"""
import argparse, json, os, re, sys, urllib.parse, urllib.request

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141 Safari/537.36"


def fetch(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read()
        return (data, r.geturl()) if binary is None else (data if binary else data.decode("utf-8", "ignore"))


def resolve(url):
    _, final = fetch(url, binary=None)
    m = re.search(r"pinterest\.[a-z.]+/([^/?#]+)/([^/?#]+)", final)
    if not m:
        sys.exit(f"не похоже на доску: {final}")
    return m.group(1), m.group(2), final


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("-o", default="moodboard")
    a = ap.parse_args()
    user, slug, final = resolve(a.url)
    print("доска:", urllib.parse.unquote(f"{user}/{slug}"))
    os.makedirs(os.path.join(a.o, "img"), exist_ok=True)

    pins = {}
    try:  # виджет-API: ~50 последних пинов
        w = json.loads(fetch(f"https://widgets.pinterest.com/v3/pidgets/boards/{user}/{slug}/pins/"))
        for p in w["data"]["pins"]:
            im = p["images"]; u = (im.get("564x") or im.get("237x"))["url"]
            pins[p["id"]] = {"id": p["id"], "url": u, "desc": p.get("description") or "", "link": p.get("link") or "", "domain": p.get("domain") or ""}
    except Exception as e:
        print("виджет-API не ответил:", e, file=sys.stderr)
    try:  # пины, встроенные в HTML доски
        html = fetch(final)
        m = re.search(r'<script id="__PWS_(?:INITIAL_PROPS|DATA)__"[^>]*>(.*?)</script>', html, re.S)
        d = json.loads(m.group(1))
        for p in d.get("initialReduxState", {}).get("pins", {}).values():
            im = p.get("images") or {}
            b = im.get("orig") or im.get("736x") or im.get("564x") or im.get("236x")
            if b:
                pins.setdefault(p["id"], {"id": p["id"], "url": b["url"], "desc": p.get("description") or p.get("title") or "", "link": p.get("link") or "", "domain": p.get("domain") or ""})
    except Exception as e:
        print("HTML доски не разобран:", e, file=sys.stderr)

    ok = []
    for p in pins.values():
        f = os.path.join(a.o, "img", f"{p['id']}.jpg")
        if not os.path.exists(f):
            for u in (re.sub(r"/(236x|474x|564x)/", "/736x/", p["url"]), p["url"]):
                try:
                    open(f, "wb").write(fetch(u, binary=True)); break
                except Exception:
                    continue
        if os.path.exists(f):
            p["file"] = f; ok.append(p)
    json.dump(ok, open(os.path.join(a.o, "pins.json"), "w"), ensure_ascii=False, indent=1)
    print("пинов скачано:", len(ok))

    try:
        from PIL import Image, ImageDraw
    except ImportError:
        sys.exit("для листов нужен Pillow: pip install pillow")
    loaded = []
    for i, p in enumerate(ok):
        try:
            loaded.append((i, Image.open(p["file"]).convert("RGB")))
        except Exception:
            pass

    def tag(im, i):
        d = ImageDraw.Draw(im); d.rectangle([0, 0, 34, 16], fill=(255, 0, 90)); d.text((4, 2), str(i), fill="white")

    W, MAXH, C = 300, 1500, 6
    for k in range(0, len(loaded), C):
        chunk = loaded[k:k + C]
        sheet = Image.new("RGB", (W * C + 8 * (C - 1), MAXH), (60, 60, 60))
        for j, (i, im) in enumerate(chunk):
            h = int(im.height * W / im.width); im2 = im.resize((W, h)).crop((0, 0, W, min(h, MAXH))); tag(im2, i)
            sheet.paste(im2, (j * (W + 8), 0))
        sheet.save(os.path.join(a.o, f"sheet-{k // C:02d}.jpg"), quality=82)
    H = 1100
    for k in range(0, len(loaded), 2):
        chunk = loaded[k:k + 2]
        out = Image.new("RGB", (736 * len(chunk) + 10 * (len(chunk) - 1), H), (60, 60, 60))
        for j, (i, im) in enumerate(chunk):
            im2 = im.resize((736, int(im.height * 736 / im.width))).crop((0, 0, 736, H)); tag(im2, i)
            out.paste(im2, (j * 746, 0))
        out.save(os.path.join(a.o, f"heroes-{k // 2:02d}.jpg"), quality=85)
    print("листы:", os.path.join(a.o, "sheet-*.jpg"), "·", os.path.join(a.o, "heroes-*.jpg"))


if __name__ == "__main__":
    main()
