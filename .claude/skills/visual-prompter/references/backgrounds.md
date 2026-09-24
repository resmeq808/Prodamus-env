# Фоны, подложки, текстуры, орнаменты, объекты

Всё, что не является «фото сцены»: подложки hero и секций, фактуры, декоративные формы, 3D-объекты, паттерны. Встречаются почти на каждом втором референсе: переливающаяся капля Securify, фиолетовый свет Oxaley, синие формы Yolo и Boulevard, камень Stone, металл METTECH, хромированные фигуры OLV.

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

---

## Как встраивать

- Фон hero — `object-fit: cover` в панели, скрим под текст (см. `airy-landing/references/art-direction.md`, приём 1).
- Бесшовная фактура — `background: url(texture.webp) 0 0 / 512px repeat`, прозрачность 20–60%.
- Объект-вырез — `<img>` на фоне того же цвета; проверить, что цвет фона кадра совпадает с земляной после `intake.py` (пипеткой, допуск ±2).
- Паттерн — `mask-image` или `opacity: .08` поверх цветного поля.
