# Фоны, подложки, текстуры, орнаменты, объекты

Всё, что не является «фото сцены»: подложки hero и секций, шумные градиенты и световые формы, фактуры, декоративные формы, 3D-объекты, паттерны. Встречаются почти на каждом втором референсе: переливающаяся капля Securify, фиолетовый свет Oxaley, синие формы Yolo и Boulevard, камень Stone, металл METTECH, хромированные фигуры OLV.

Главное правило: **фон работает на текст, а не спорит с ним**. Большая спокойная зона, один центр внимания, цвет из палитры сайта.

---

## 1. Световой градиент (аврора)
Фон hero или финала без фото: мягкое пятно света на тёмном.

> Create an abstract background image for a website hero section, wide 16:9 composition. A soft glowing gradient of deep violet (#3b1bd6) light rising from the bottom centre and fading into a near-black background (#0b0b0c), like light leaking under a door, very smooth transitions, subtle fine film grain across the whole image, no objects, no shapes, no text. The top two thirds stay dark and calm for a headline.

## 2. Переливающаяся форма
Один объект-символ продукта на тёмном фоне, сбоку — место под заголовок.

> Create a 3D render for a website hero, wide 16:9 composition. A single fluid organic blob of iridescent liquid glass with thin-film rainbow reflections in orange, magenta and blue, softly glowing from within, floating in the right half of the frame against a pure near-black background (#0b0b0c). Soft studio lighting, subtle caustics, gentle depth of field, very clean and premium. The left half is completely empty for text. No text, no logos.

## 3. Хром и жидкий металл
Для техники, безопасности, промышленности, «инженерного» премиума.

> A 3D render of three abstract chrome ribbons twisting in space, mirror-polished liquid metal reflecting a soft grey studio environment, on a seamless light grey background (#e4e4e1), soft contact shadows, precise and cold, square 1:1 composition with the object centred and generous empty space around it.

## 4. Фактура материала — бесшовная подложка секции
Камень, бетон, бумага, ткань, дерево: тихая фактура под светлый лист или карточку.

> Create a seamless tileable texture, square 1:1, top-down flat view. Fine-grained warm grey travertine stone with subtle natural pores and very soft veins, evenly lit with diffused light, no shadows, no perspective, low contrast so text can sit on top, colour close to #e7e2d8.

Варианты материала: «raw concrete with subtle formwork marks», «heavy cotton paper with visible fibres», «washed linen fabric», «brushed aluminium», «dark oak with fine grain», «black volcanic sand». Для бесшовности просите «seamless tileable», «evenly lit», «no perspective»; проверяйте стык, поставив две копии рядом.

## 5. Зерно и шум
Отдельный слой зерна лучше делать кодом (SVG feTurbulence — уже есть в `airy-landing`), но для плёночного эффекта:

> A full-frame 35mm film grain texture on a neutral mid-grey background, organic irregular grain, no image content, square 1:1, for use as an overlay.

## 6. Орнамент и паттерн
Для брендов с культурным кодом, отелей, ресторанов, упаковки.

> Create a seamless repeating pattern, square 1:1. A refined geometric ornament inspired by Art Deco fan motifs, thin gold lines (#b8975a) on a deep green background (#0f2a22), even spacing, precise vector-like lines, elegant and restrained, no text.

Варианты: «Japanese seigaiha wave pattern», «Moroccan zellige star lattice», «Scandinavian knit motif», «Bauhaus circles and squares in two colours», «hand-drawn botanical line pattern». Паттерн на странице — фоном 5–10% прозрачности или внутри одной панели.

## 7. Объект-вырез
Предмет, который стоит на странице «без фона» — рядом с заголовком, за словом, между строк (приём 17 `art-direction.md`). Прозрачности нет, поэтому фон кадра = цвет страницы.

> A high-end product photograph of a rough natural white marble stone with sharp crystalline edges, floating and slowly rotating, dramatic soft top light, soft realistic shadow below, isolated on a perfectly uniform seamless background in exactly #0b0b0c, square 1:1, object centred with empty space around.

## 8. Иконка-объект в 3D
Для карточек преимуществ вместо плоских иконок (Sharing Your Vision — мегафон, Private Equity — 3D-персонаж).

> A single 3D icon of a padlock made of frosted translucent glass with a soft orange glow inside, clean studio lighting, isolated on a seamless background in exactly #efeee9, soft shadow, square 1:1, centred. Minimal, premium, no text.

Делайте серию одним промтом-шаблоном, меняя только предмет: «a padlock», «a clock», «a stack of coins», «a paper plane».

## 9. Световые следы и смаз
Абстрактная подложка про скорость: длинная выдержка огней.

> A long-exposure photograph of city traffic light trails at night, abstract and soft, warm orange and red streaks flowing diagonally across the lower third of the frame, the rest is deep dark blue-black, wide 21:9 composition, film grain, no cars visible, no text.

## 10. Фон карточки с цветом бренда
Цветное поле с фактурой вместо плоской заливки (Future of Private Equity, Boulevard).

> An abstract background, vertical 3:4, saturated cobalt blue (#1f3fd6) with soft flowing folds like silk fabric catching light, subtle highlights and deep shadows in the same hue, no other colours, very smooth, room for white text in the lower half.

## Шумные градиенты и световые формы

Подложки, которые несут экран вместо фото: Spectral Gradient, Whalechip, Katartizo, Septem, Cura Sentimento, айдентика бухгалтерской компании design.atum. Правила — приём 19 в `airy-landing/references/art-direction.md`: спокойное поле 60–80%, форма у края, 1–2 цвета, сильное зерно, один вид на сайт. Генерировать только когда они нужны странице — это не обязательный слой.

Общий хвост для всей серии подложек (вместо STYLE BLOCK фото):

```
BACKDROP STYLE: abstract, no objects, no text, no logos; strong fine film grain over the whole image like a risograph or high-ISO film scan; very soft out-of-focus edges; limited palette; most of the frame is a calm near-flat field for text.
```

В промтах 12–16 `BACKDROP STYLE: …` означает: вклеить хвост выше целиком, дословно.

### 11. Шумный градиент из угла
> Create an abstract grainy gradient background, wide 16:9. A soft glowing shape of electric blue (#2a5bff) and pale ice blue (#bfe0ff) rises from the bottom right corner and dissolves into a deep near-black field (#060608) that fills the upper left two thirds of the frame. Smooth, blurry transitions with no hard edges. BACKDROP STYLE: abstract, no objects, no text, no logos; strong fine film grain over the whole image like a risograph or high-ISO film scan; very soft out-of-focus edges; limited palette; most of the frame is a calm near-flat field for text.

Светлый вариант: «…dissolves into a soft off-white field (#f2f1ee)…» — для светлых сайтов (синий на белом, как визитки и постеры design.atum).

### 12. Световой луч
> Create an abstract background, wide 16:9. A single wide diagonal beam of warm light — burnt orange (#e8541e) at its core fading to deep red and then to black — crosses from the lower left towards the upper right, soft and hazy like light through fog. The rest of the frame is a near-black field (#0a0808). BACKDROP STYLE: …

### 13. Волна-силуэт
> Create an abstract background, square 1:1. Three soft blurry peaks of flame-like light rise from the bottom edge, glowing from deep indigo at the base through red and orange to pale yellow at the tips, against a flat dusty lavender field (#8f86b8) that fills the upper half. Heat-haze softness, no sharp lines. BACKDROP STYLE: …

Вариант «звук / ритм»: «a row of thin vertical spikes of acid lime (#9be31c) light hanging from the top edge like a sound wave, fading into black».

### 14. Пиксельный градиент
> Create an abstract background, vertical 3:4. A blurry glowing shape of acid lime (#c6f432) and deep green light on a black field, rendered as a coarse mosaic of large square pixels about 1/40 of the frame width, each pixel a flat colour, like an extremely low-resolution image enlarged. The shape occupies the upper right; the lower left is almost black. BACKDROP STYLE: …

### 15. Рифлёное стекло
> Create an abstract photograph, vertical 3:4. A glowing gradient of electric blue (#1f4bff) light seen through a sheet of vertically reeded (fluted) glass: dozens of narrow vertical ribs each refract and stretch the light into sharp repeating streaks, with bright highlights on the rib edges and deep blue-black between them. Dark navy at the bottom, bright blue at the top. Studio macro photograph, crisp ribs, BACKDROP STYLE: …

### 16. Шёлковые складки
> Create an abstract 3D render, vertical 3:4. Long flowing folds of satin fabric in deep teal (#0f7a6c) fan out from the upper right corner and sweep down into darkness, soft specular highlights running along each fold, the lower left falls into pure black. Smooth, elegant, single colour. BACKDROP STYLE: …

### 17. Переливающиеся ленты
> Create an abstract 3D render, vertical 3:4. Two thick loops of transparent glass tubing twist through the frame on a pure black background, with strong chromatic dispersion — thin rainbow edges of orange, magenta and blue along every curve, bright white highlights, dark refracted interiors. The loops fill the right side; the left third stays black. No text, no logos.

Как собирать серию подложек: первую удачную приложить референсом и менять только положение формы и формат — «Same style, colour and grain as the attached image; move the glow to the top left corner, vertical 4:5».

---

## Как встраивать

- Фон hero — `object-fit: cover` в панели, скрим под текст (см. `airy-landing/references/art-direction.md`, приём 1).
- Бесшовная фактура — `background: url(texture.webp) 0 0 / 512px repeat`, прозрачность 20–60%.
- Объект-вырез — `<img>` на фоне того же цвета; проверить, что цвет фона кадра совпадает с земляной после `intake.py` (пипеткой, допуск ±2).
- Паттерн — `mask-image` или `opacity: .08` поверх цветного поля.
