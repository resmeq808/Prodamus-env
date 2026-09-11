# Prodamus-env

Скиллы Claude для вёрстки лендингов. Каждый собран разбором реальных сайтов: полностраничные скриншоты, HTML, CSS, вычисленные палитры и типографические шкалы.

## `industrial-landing` — коммерция производственных компаний

Сдержанный, плотный, доказательный лендинг: тёмное фото реального производства, один деловой акцент, цифры с расшифровкой, карточки направлений, каталог, подбор.

Собран разбором **16 сайтов**: izhorastalinvest.ru, irstone.pro, monaer-russia.ru, trust-pay.ru, easybuild.by, blackwood.dev, propoly.pro, brick-art.ru, stanisla.ru, woodpecker-shop.tilda.ws, data-point.ru, artemlysenko.com, главный-путь.рф, airdog.m-mukhanov.ru, kurs.m-mukhanov.ru, siding-moldova.md.

```
.claude/skills/industrial-landing/
├── SKILL.md                  три закона жанра, процесс, правила
├── references/
│   ├── research.md           разбор 16 сайтов + пять вертикалей
│   ├── system.md             палитры, шрифты, шкала, сетка, кнопки
│   ├── blocks.md             21 блок с готовым HTML и CSS
│   ├── copy.md               тексты: заголовки, числа, кнопки, тон
│   ├── photography.md        что снимать, как обрабатывать, иконки
│   └── anti-patterns.md      35 анти-паттернов
└── assets/
    ├── tokens.css            база проекта
    └── starter.html          рабочий скелет, проверен на 1440 / 768 / 390 / 360
```

## `festival-landing` — событийная афиша

Громкий постерный лендинг: плакатная типографика, один кислотный акцент, коллаж, наклейки, бегущие строки, свечение. Для фестивалей, конференций, премий, воркшопов, спецпроектов.

Собран разбором 13 самых залайканных проектов галереи [#madeontilda](https://tilda.cc/ru/madeontilda/) за сентябрь 2025 — сентябрь 2026 (из 972 опубликованных за период).

```
.claude/skills/festival-landing/
├── SKILL.md
├── references/   research · archetypes · palettes · typography · moves · sections · anti-patterns
└── assets/       tokens.css · starter.html
```

## Как выбрать

| Задача | Скилл |
|---|---|
| Завод, подряд, оборудование, логистика, B2B-поставки | `industrial-landing` |
| Фестиваль, конференция, премия, спецпроект, лонгрид | `festival-landing` |

Оба подхватываются автоматически по формулировке задачи.
