# Gemini: как писать промты для изображений

Сжатая выжимка официальных материалов Google — [Gemini API: image generation](https://ai.google.dev/gemini-api/docs/image-generation), [How to prompt Gemini 2.5 Flash Image](https://developers.googleblog.com/en/how-to-prompt-gemini-2-5-flash-image-generation-for-the-best-results/), [Ultimate prompting guide for Nano Banana](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana), [Nano Banana Pro prompting tips](https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/) — плюс то, что важно именно для сайтов. Проверено на сентябрь 2026: модели и лимиты меняются, при сомнении сверяйтесь с документацией.

---

## Модели и возможности

| Модель | Как называется в интерфейсе | Когда |
|---|---|---|
| Gemini 3 Pro Image | Nano Banana Pro | Hero, финал, всё, что крупно: лучшая детализация, 2K/4K, лучше держит серию и текст |
| Gemini 3.1 Flash Image | Nano Banana 2 | Карточки, фоны, текстуры, варианты; быстрее, до 4K |
| Gemini 3.1 Flash Lite Image | — | Черновики композиции; только 1K |

- **Соотношения сторон:** 1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9 (у Nano Banana 2 ещё 1:4, 4:1, 1:8, 8:1). В приложении Gemini формат надёжнее всего задать словами в начале промта: «wide 16:9 composition», «vertical 3:4 portrait format».
- **Разрешение:** 1K, 2K, 4K (в AI Studio и API выбирается явно; в приложении зависит от тарифа).
- **Референсы:** до 14 изображений в запросе; у Pro — до 6 предметов, до 5 персонажей, до 3 референсов стиля.
- **Водяные знаки:** все изображения несут невидимую метку SynthID. В приложении Gemini на части тарифов в углу может стоять видимый значок — оставляйте в композиции запас по краям, чтобы обрезать, или генерируйте в AI Studio.
- **Прозрачный фон модель не делает.** Для объектов-вырезов генерируйте на сплошном фоне цвета страницы (hex в промте), тогда вырезать не нужно.
- **Диалог:** модель помнит кадр — правки делаются следующими сообщениями в том же чате. Если черты персонажа «поплыли» после многих правок — новый чат с полным описанием и референсом.

---

## Формула

Официальная формула Google: **Субъект + Действие + Место/контекст + Композиция + Стиль**. Для сайта добавляем **Назначение** и **Зону текста**:

```
[Назначение] Create a photograph for a website <slot>, <aspect> composition.
[Субъект]    <кто или что, с материалами и деталями>
[Действие]   <что происходит>
[Место]      <где, когда, погода, время суток>
[Композиция] <план, ракурс, где объект в кадре, где пустое пространство под текст, куда смотрит человек>
[Стиль]      <STYLE BLOCK: камера, объектив, свет, плёнка, грейдинг, палитра, настроение>
[Хвост]      No text, no logos, no watermarks.
```

Пример (hero платёжного сервиса):

> Create a photograph for a website hero banner, wide 16:9 composition. A narrow shopping street in a big city at night after rain, glowing shop windows and hanging paper lanterns, a single cyclist crossing the frame from left to right with motion blur, a few pedestrians under umbrellas far in the background. The wet asphalt reflects the warm lights. The cyclist is placed in the right third of the frame; the left half is darker and calmer, with soft out-of-focus lights, leaving clean negative space for a large headline. Shot on a 35mm cinema camera with a 40mm anamorphic lens, available practical light only: warm sodium street lamps and neon shop signs, deep crushed shadows, gentle halation around highlights, subtle 35mm film grain, warm amber highlights against cool teal-green shadows, low saturation except the orange signage, candid documentary feel. Signs are blurred and unreadable. No text, no logos, no watermarks.

---

## Шаблоны Google, адаптированные под сайт

**Фотореалистичная сцена**
«A photorealistic [план] of [субъект], [действие], set in [окружение]. The scene is illuminated by [свет], creating a [настроение] atmosphere. Captured with a [камера/объектив], emphasizing [фактуры]. [Композиция и зона текста]. [Формат].»

**Предметная съёмка**
«A high-resolution, studio-lit product photograph of a [предмет] on a [поверхность/фон]. The lighting is a [схема света] to [цель света]. The camera angle is a [ракурс] to showcase [деталь]. Ultra-realistic, with sharp focus on [деталь]. [Формат].»

**Минимализм и пустое пространство** — лучший шаблон для фонов под текст
«A minimalist composition featuring a single [объект] positioned in the [место] of the frame. The background is a vast, empty [цвет, hex] canvas, creating significant negative space. Soft, subtle lighting. [Формат].»

**Правка элемента**
«Using the provided image, change only the [элемент] to [новое]. Keep everything else exactly the same, preserving the original style, lighting, and composition.»

**Добавить или убрать**
«Using the provided image of [субъект], please [add/remove/modify] [элемент]. Ensure the change is [как вписать].»

**Перенос стиля на серию**
«Use the attached image as the style, lighting and colour reference. Create a new photograph in exactly the same style: [новая сцена]. [Формат].»

**Сборка из нескольких изображений**
«Create a new image by combining the provided images: take the [элемент из 1] and place it in the [сцена из 2]. The final image should be [описание].»

---

## Словарь

**План и ракурс:** extreme close-up, close-up, medium shot, full body, wide establishing shot, overhead flat lay, top-down, low-angle, eye-level, three-quarter view, Dutch angle, over-the-shoulder.

**Объектив и фокус:** 24mm wide, 35mm, 50mm, 85mm portrait, 100mm macro, anamorphic, tilt-shift; shallow depth of field (f/1.4–f/2), deep focus (f/8–f/11), soft background bokeh, motion blur, long exposure light trails.

**Свет:** soft window light, overcast diffused daylight, golden hour backlight, blue hour, hard midday sun with sharp shadows, chiaroscuro, single hard key light from the side, rim light, softbox three-point studio light, practical lights (lamps, neon, screens), sodium street lamps, candlelight.

**Плёнка и обработка:** 35mm film grain, Kodak Portra 400 (тёплые мягкие тона кожи), Kodak Ektar (насыщенно), Fujifilm Pro 400H (прохладная пастель), Ilford HP5 black and white, CineStill 800T (ночь, красные ореолы), medium-format, cross-processed, muted teal-and-amber grade, bleach bypass, matte faded blacks, high-key, low-key.

**Материалы:** вместо «пиджак» — «navy wool tweed jacket»; вместо «стол» — «raw oak table with visible grain»; brushed aluminium, frosted glass, polished chrome, travertine, terrazzo, linen, bouclé, raw concrete, anodised titanium, ceramic with matte glaze.

---

## Лучшие практики

1. **Сцена абзацем, а не список ключевых слов** — главный совет Google.
2. **Конкретика важнее прилагательных**: «warm sodium street lamps» вместо «beautiful lighting».
3. **Назначение и контекст**: «for a website hero banner with a headline on the left» — модель сама оставит место.
4. **Позитивная формулировка**: «an empty street» вместо «no cars».
5. **Язык камеры**: объектив, диафрагма, ракурс.
6. **Итерации в том же чате**: широкий первый промт → точечные правки.
7. **Серия через референс**: первый удачный кадр прикладывается ко всем следующим как стиль.
8. **Шаг за шагом для сложных сцен**: сначала фон, потом объект, потом свет.
9. **Не писать «8K, masterpiece, trending on artstation»** — это не работает и делает кадр «нейросетевым».

---

## Ограничения и обходы

| Проблема | Обход |
|---|---|
| Псевдотекст на вывесках, экранах, упаковке | «Signs are blurred and unreadable», «screen shows soft abstract light», упаковка без надписей |
| Руки и пальцы | Руки в движении, частично в тени или за краем кадра; крупные планы рук — отдельным промтом с описанием позы |
| «Пластиковая» кожа, идеальная симметрия | «natural skin texture with pores, subtle imperfections, candid moment», плёнка Portra, мягкий свет |
| Слишком чисто и глянцево | зерно, «slightly underexposed», «documentary», «available light» |
| Повторяющиеся лица в серии | в каждом промте описывать разных людей: возраст, волосы, одежду |
| Реальные бренды и логотипы | не упоминать; «unbranded», «generic» |
| Нет прозрачности | сплошной фон цвета страницы (hex) |
| Разный цвет в серии | один STYLE BLOCK дословно + первый кадр как референс + `intake.py --grade` при обработке |
