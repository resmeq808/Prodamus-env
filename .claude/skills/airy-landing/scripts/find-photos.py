#!/usr/bin/env python3
"""Подбор свободных фотографий под арт-дирекшн страницы.

Ищет через открытый API Openverse (api.openverse.org) только по источникам
с качественной фотографией и свободной лицензией: StockSnap, каталог фото
WordPress, rawpixel. Скачивает превью, собирает контактный лист — его нужно
открыть и выбрать кадры глазами, а не брать первые результаты.

  python3 find-photos.py "motion blur runner" "woman phone night" -n 12 -o ./photos
  python3 find-photos.py --get 3 17 -o ./photos --dest ./site/img   # скачать выбранные в полном размере

Результат в папке -o:
  sheet-<запрос>.jpg     контактный лист с номерами
  results.json           номер → url, размер, лицензия, автор, страница

Лицензии: CC0 и Public Domain не требуют подписи; для CC BY автор и ссылка
обязательны (поле attribution). Pillow нужен для контактного листа.
"""
import argparse, json, os, re, sys, urllib.parse, urllib.request

API = "https://api.openverse.org/v1/images/"
SOURCES = "wordpress,stocksnap,rawpixel"   # wordpress — до 2048px, лучше всего для hero
UA = {"User-Agent": "airy-landing-skill/1.0"}


def get(url, binary=False, referer=None):
    headers = dict(UA)
    if referer:
        headers["Referer"] = referer
        headers["User-Agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/141 Safari/537.36"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    return data if binary else json.loads(data)


def search(q, n, orientation, license_, sources=SOURCES):
    params = {"q": q, "source": sources, "page_size": min(n, 50), "license": license_, "mature": "false"}
    if orientation:
        params["aspect_ratio"] = orientation   # wide | tall | square
    return get(API + "?" + urllib.parse.urlencode(params)).get("results", [])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("queries", nargs="*")
    ap.add_argument("--get", nargs="+", type=int, help="номера из results.json — скачать в полном размере")
    ap.add_argument("--dest", default=None, help="куда класть скачанные (--get)")
    ap.add_argument("-n", type=int, default=12, help="кадров на запрос")
    ap.add_argument("-o", default="photos")
    ap.add_argument("--orientation", choices=["wide", "tall", "square"])
    ap.add_argument("--license", default="cc0,pdm,by", help="cc0,pdm — без обязательной подписи")
    ap.add_argument("--sources", default=SOURCES, help="для hero: --sources wordpress (кадры до 2048px)")
    a = ap.parse_args()
    os.makedirs(a.o, exist_ok=True)
    if a.get:
        meta = json.load(open(os.path.join(a.o, "results.json")))
        dest = a.dest or os.path.join(a.o, "full")
        os.makedirs(dest, exist_ok=True)
        credits = []
        for num in a.get:
            it = meta[str(num)]
            ext = os.path.splitext(urllib.parse.urlparse(it["url"]).path)[1] or ".jpg"
            p = os.path.join(dest, f"photo-{num:03d}{ext}")
            ref = "https://stocksnap.io/" if "stocksnap" in it["url"] else None
            open(p, "wb").write(get(it["url"], binary=True, referer=ref))
            credits.append(f"{os.path.basename(p)} — {it.get('creator') or 'автор не указан'}, {it['source']}, {it['license'].upper()} — {it.get('page')}")
            print("скачано:", p, f"({it['width']}×{it['height']}, {it['license']})")
        open(os.path.join(dest, "CREDITS.txt"), "a").write("\n".join(credits) + "\n")
        print("атрибуция:", os.path.join(dest, "CREDITS.txt"))
        return
    if not a.queries:
        ap.error("нужен хотя бы один запрос или --get")
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        Image = None
        print("Pillow не установлен — контактный лист не будет собран (pip install pillow)", file=sys.stderr)

    out, k = {}, 0
    for q in a.queries:
        res = search(q, a.n, a.orientation, a.license, a.sources)
        thumbs = []
        for r in res:
            k += 1
            item = {
                "n": k, "query": q, "url": r["url"], "width": r.get("width"), "height": r.get("height"),
                "license": r.get("license"), "license_url": r.get("license_url"), "source": r.get("source"),
                "creator": r.get("creator"), "page": r.get("foreign_landing_url"),
                "attribution": r.get("attribution"), "title": r.get("title"),
            }
            out[k] = item
            if Image:
                try:
                    p = os.path.join(a.o, f"{k:03d}.jpg")
                    if not os.path.exists(p):
                        open(p, "wb").write(get(r.get("thumbnail") or r["url"], binary=True))
                    thumbs.append((k, p))
                except Exception as e:
                    print("не скачалось", k, e, file=sys.stderr)
        if Image and thumbs:
            W, H, C = 360, 240, 4
            rows = (len(thumbs) + C - 1) // C
            sheet = Image.new("RGB", (C * W + (C - 1) * 6, rows * H + (rows - 1) * 6), (40, 40, 40))
            for i, (num, p) in enumerate(thumbs):
                try:
                    im = Image.open(p).convert("RGB")
                    im.thumbnail((W * 2, H * 2))
                    s = max(W / im.width, H / im.height)
                    im = im.resize((int(im.width * s) + 1, int(im.height * s) + 1))
                    im = im.crop(((im.width - W) // 2, (im.height - H) // 2, (im.width - W) // 2 + W, (im.height - H) // 2 + H))
                    d = ImageDraw.Draw(im)
                    d.rectangle([0, 0, 58, 18], fill=(255, 0, 90))
                    d.text((4, 3), f"{num} {out[num]['license']}", fill="white")
                    sheet.paste(im, ((i % C) * (W + 6), (i // C) * (H + 6)))
                except Exception:
                    pass
            slug = re.sub(r"[^a-z0-9а-я]+", "-", q.lower()).strip("-")[:40]
            sheet.save(os.path.join(a.o, f"sheet-{slug}.jpg"), quality=82)
            print("лист:", os.path.join(a.o, f"sheet-{slug}.jpg"), f"({len(thumbs)} кадров)")
    json.dump(out, open(os.path.join(a.o, "results.json"), "w"), ensure_ascii=False, indent=1)
    print("метаданные:", os.path.join(a.o, "results.json"))


if __name__ == "__main__":
    main()
