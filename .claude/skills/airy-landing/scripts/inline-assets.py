#!/usr/bin/env python3
"""Собирает страницу в один HTML-файл: встраивает локальные картинки как data URI.

  python3 inline-assets.py site/index.html site/index.standalone.html

Зачем: страница ссылается на img/*.webp. Если пользователь скачает только
HTML, картинок не будет. Для показа и пересылки отдавайте standalone-файл,
для продакшена — обычную версию с папкой img/ (так браузер кэширует картинки).

Встраиваются src="…", poster="…" и url(…)
в CSS, если путь относительный и файл существует. Шрифты с CDN не трогаются.
"""
import base64, mimetypes, os, re, sys

MIME = {".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
        ".gif": "image/gif", ".svg": "image/svg+xml", ".avif": "image/avif"}


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else re.sub(r"\.html?$", "", src) + ".standalone.html"
    base = os.path.dirname(os.path.abspath(src))
    html = open(src, encoding="utf-8").read()
    cache, missing = {}, set()

    def data_uri(path):
        if re.match(r"^(https?:|data:|//|#|mailto:|tel:)", path):
            return None
        clean = path.split("?")[0].split("#")[0]
        ext = os.path.splitext(clean)[1].lower()
        if ext not in MIME:
            return None
        full = os.path.normpath(os.path.join(base, clean))
        if not os.path.exists(full):
            missing.add(path); return None
        if full not in cache:
            cache[full] = f"data:{MIME[ext]};base64," + base64.b64encode(open(full, "rb").read()).decode()
        return cache[full]

    def attr(m):
        uri = data_uri(m.group(2))
        return f'{m.group(1)}="{uri}"' if uri else m.group(0)

    def css(m):
        uri = data_uri(m.group(2))
        return f"url({m.group(1)}{uri}{m.group(1)})" if uri else m.group(0)

    # preload картинки не нужен: она уже внутри файла, а base64 удвоил бы вес
    html = re.sub(r'<link[^>]+rel="preload"[^>]+as="image"[^>]*>\s*', "", html)
    html = re.sub(r'\b(src|href|poster)="([^"]+)"', attr, html)
    html = re.sub(r'url\((["\']?)([^)"\']+)\1\)', css, html)
    open(out, "w", encoding="utf-8").write(html)
    size = os.path.getsize(out) / 1024
    print(f"готово: {out} — {size:.0f} КБ, встроено файлов: {len(cache)}")
    if missing:
        print("не найдены:", ", ".join(sorted(missing)), file=sys.stderr)


if __name__ == "__main__":
    main()
