# Пример: пакет промтов для Selix

Демо-лендинг `examples/selix/` собран на свободных фото. Здесь — как выглядел бы пакет для варианта «Много» (12 промтов), если бы визуал генерировался в Gemini. Этот файл — образец формата `visual-prompts.md`.

---

## Идея и блок стиля

**Идея:** «Город, который не спит. Ночные улицы, рынки и витрины, люди в движении — оплаты приходят в любое время, и ни одна не теряется».

**Палитра:** тёмная земля #0b0b0c, тени teal-black, тёплые огни amber, единственный яркий цвет — оранжевый #ff6a1f (акцент страницы, кнопки и орб).

**STYLE BLOCK** (вставлен в конец каждого фото-промта дословно):

```
Shot on a 35mm cinema camera with a 40mm anamorphic lens, available practical light only — warm sodium street lamps, neon signs and glowing shop windows — deep crushed shadows, gentle halation around highlights, subtle 35mm film grain, warm amber highlights against cool teal-green shadows, low overall saturation with orange (#ff6a1f) signage as the only strong colour, slightly underexposed, candid documentary feel, no posing, no readable text anywhere, no logos.
```

## Съёмочный лист

| ID | Место | Формат | Что в кадре | Зона текста | Пр. |
|---|---|---|---|---|---|
| H1 | hero, панель на весь экран | 16:9, 2K | ночная торговая улица, велосипедист в смазе | левая половина и нижняя треть | О |
| C1 | карточка «Оплата частями», широкая | 4:3, 2K | продавец за прилавком ночного рынка передаёт покупку | нижняя треть | О |
| C2 | карточка «В один клик» | 3:2, 2K | рука с телефоном у витрины, лицо не видно | нижняя треть | О |
| C3 | карточка «Умные повторы», вертикаль | 3:4, 2K | ночная прачечная или круглосуточный магазин, свет изнутри | нижняя треть | О |
| C4 | карточка «Брошенные оплаты», вертикаль | 2:3, 2K | человек у окна трамвая, смотрит в телефон | нижняя треть | О |
| I1 | блок «Подключение» | 4:5, 2K | высотка с окнами в ночи снизу вверх | нет | Ж |
| F1 | финальная панель | 16:9, 2K | площадь с толпой и огнями сверху | центр | О |
| A1–A3 | аватары в строке манифеста | 1:1, 1K | три разных лица в том же свете | нет | Ж |
| B1 | объект для блока безопасности | 1:1, 2K | карта из матового стекла со светом внутри | нет | Д |
| OG | og:image | 16:9 | из H1 | левая половина | Ж |

Порядок: H1 → (H1 как референс) C1–C4, I1, F1 → A1–A3 → B1 отдельной веткой → OG из готового H1.

---

## Промты

### H1 · Hero · 16:9 · 2K
**Зачем:** первый экран. Слева ляжет гигантский заголовок «Продажи, которые не теряются», внизу — кнопки и строка HUD.
**Модель:** Nano Banana Pro, 16:9, 2K. Первый кадр — от него строится серия; сгенерировать 3–4 варианта и выбрать.

```
Create a photograph for a website hero banner, wide 16:9 composition. A narrow street market at night in a big city: a courier in a dark rain jacket rides a bicycle through the frame from right to left, his body sharp but the wheels and the background streaked with motion blur. Stalls with warm hanging bulbs line the right side, an orange neon sign glows softly out of focus, the wet paving stones reflect the lights. The courier and all bright detail sit in the right half of the frame; the left half and the bottom third fall into deep, calm shadow with only soft reflections, leaving clean space for a large headline and buttons. Camera at eye level, slight low angle. Shot on a 35mm cinema camera with a 40mm anamorphic lens, available practical light only — warm sodium street lamps, neon signs and glowing shop windows — deep crushed shadows, gentle halation around highlights, subtle 35mm film grain, warm amber highlights against cool teal-green shadows, low overall saturation with orange (#ff6a1f) signage as the only strong colour, slightly underexposed, candid documentary feel, no posing, no readable text anywhere, no logos.
```

**Если не вышло:**
- «Make the left half of the frame darker and emptier, keep everything else exactly the same.»
- «Replace any letters on the signs with soft unreadable glow, keep everything else the same.»
- «Less saturated and less glossy, like a real film photograph; keep composition.»

---

### C1 · Оплата частями · 4:3 · 2K
**Зачем:** широкая карточка, заголовок и подпись в нижней трети, HUD-метка в верхнем левом углу.
**Модель:** та же; приложить принятый H1 как референс стиля.

```
Use the attached image as the style, lighting and colour reference. Create a photograph, horizontal 4:3 composition. At a night food market, an older vendor behind a wooden stall hands a paper bag of oranges across the counter to a customer whose back is turned to the camera; their hands meet in the warm light of a single bare bulb. Steam rises from a pot at the edge of the frame. The action sits in the upper two thirds; the lower third is the dark wooden counter falling into shadow, calm enough for a white headline. Shot on a 35mm cinema camera with a 40mm anamorphic lens, available practical light only — warm sodium street lamps, neon signs and glowing shop windows — deep crushed shadows, gentle halation around highlights, subtle 35mm film grain, warm amber highlights against cool teal-green shadows, low overall saturation with orange (#ff6a1f) signage as the only strong colour, slightly underexposed, candid documentary feel, no posing, no readable text anywhere, no logos.
```

**Если не вышло:** руки — «Fix the hands: natural hands with five fingers, partially in shadow, keep everything else the same.»

---

### C2 · В один клик · 3:2 · 2K
**Зачем:** карточка про сохранённую карту: покупка в одно касание.

```
Use the attached image as the style, lighting and colour reference. Create a photograph, horizontal 3:2 composition. A close view of a hand holding a smartphone in front of a glowing shop window at night, the thumb just touching the screen; the screen shows only a soft abstract orange glow, no interface, no text. The person's face is out of frame; the window behind dissolves into warm bokeh. The phone and hand sit in the left-centre, the bottom third darkens into the sleeve of a dark coat for text. Shot on a 35mm cinema camera with a 40mm anamorphic lens, available practical light only — warm sodium street lamps, neon signs and glowing shop windows — deep crushed shadows, gentle halation around highlights, subtle 35mm film grain, warm amber highlights against cool teal-green shadows, low overall saturation with orange (#ff6a1f) signage as the only strong colour, slightly underexposed, candid documentary feel, no posing, no readable text anywhere, no logos.
```

---

### C3 · Умные повторы · 3:4 · 2K
**Зачем:** вертикальная карточка: «повторим списание, когда деньги появятся» — метафора «ночь продолжается, магазин открыт».

```
Use the attached image as the style, lighting and colour reference. Create a photograph, vertical 3:4 composition. A small 24-hour corner shop at night seen from across an empty wet street: warm light pours from the large window, a single shopkeeper arranges shelves inside, a bicycle leans against the wall. The shop fills the upper half of the frame; the lower half is the dark street with long reflections of the window, calm and empty for a headline. Shot on a 35mm cinema camera with a 40mm anamorphic lens, available practical light only — warm sodium street lamps, neon signs and glowing shop windows — deep crushed shadows, gentle halation around highlights, subtle 35mm film grain, warm amber highlights against cool teal-green shadows, low overall saturation with orange (#ff6a1f) signage as the only strong colour, slightly underexposed, candid documentary feel, no posing, no readable text anywhere, no logos.
```

---

### C4 · Брошенные оплаты · 2:3 · 2K
**Зачем:** вертикальная карточка: покупатель ушёл, но вернётся по письму.

```
Use the attached image as the style, lighting and colour reference. Create a photograph, vertical 2:3 composition. A young woman sits by the window of a night tram, her face softly lit from below by her phone screen, city lights streaking past outside the glass in long motion blur. She is in the upper half of the frame, looking down at the phone, calm and thoughtful. The lower third is the dark tram seat and her coat, quiet enough for text. Shot on a 35mm cinema camera with a 40mm anamorphic lens, available practical light only — warm sodium street lamps, neon signs and glowing shop windows — deep crushed shadows, gentle halation around highlights, subtle 35mm film grain, warm amber highlights against cool teal-green shadows, low overall saturation with orange (#ff6a1f) signage as the only strong colour, slightly underexposed, candid documentary feel, no posing, no readable text anywhere, no logos.
```

**Если не вышло:** кожа — «Add natural skin texture with visible pores, keep the lighting and composition.»

---

### I1 · Подключение · 4:5 · 2K

```
Use the attached image as the style, lighting and colour reference. Create a photograph, vertical 4:5 composition. Looking straight up at a tall residential tower at night from the street, hundreds of windows, most dark, a scattered few glowing warm amber and one glowing orange, the building converging towards a deep blue-black sky. Strong geometric rhythm of balconies, the facade fills the frame edge to edge. Shot on a 35mm cinema camera with a 40mm anamorphic lens, available practical light only — warm sodium street lamps, neon signs and glowing shop windows — deep crushed shadows, gentle halation around highlights, subtle 35mm film grain, warm amber highlights against cool teal-green shadows, low overall saturation with orange (#ff6a1f) signage as the only strong colour, slightly underexposed, candid documentary feel, no posing, no readable text anywhere, no logos.
```

---

### F1 · Финал · 16:9 · 2K
**Зачем:** финальная панель, заголовок «Подключите Selix сегодня» по центру, кнопки ниже.

```
Use the attached image as the style, lighting and colour reference. Create a photograph for a website closing banner, wide 16:9 composition. A city square at night seen from a high balcony: a crowd of small figures crosses in every direction, some blurred by the long exposure, warm light from cafés around the edges, a single orange neon glow in the far corner. The busy life is pushed to the outer edges and the bottom of the frame; the centre of the square is a wide dark empty paved area, calm enough for a centred headline and two buttons. Shot on a 35mm cinema camera with a 40mm anamorphic lens, available practical light only — warm sodium street lamps, neon signs and glowing shop windows — deep crushed shadows, gentle halation around highlights, subtle 35mm film grain, warm amber highlights against cool teal-green shadows, low overall saturation with orange (#ff6a1f) signage as the only strong colour, slightly underexposed, candid documentary feel, no posing, no readable text anywhere, no logos.
```

---

### A1–A3 · Аватары · 1:1 · 1K
**Зачем:** три кружка в строке манифеста «Каждый пятый покупатель [лица] уходит». Это иллюстрация, не отзывы — генерировать допустимо. Один шаблон, меняется только человек.

```
Use the attached image as the style, lighting and colour reference. Create a square 1:1 close-up portrait photograph of [a man in his forties with a short grey beard and a dark wool coat / a young woman with short black hair and small silver earrings / a man in his twenties in a knitted beanie], face centred and filling most of the frame, looking slightly off camera, lit by warm shop window light from one side, deep shadow on the other, natural skin texture, dark blurred street behind. Shot on a 35mm cinema camera, subtle film grain, warm amber and teal grade, slightly underexposed, candid, no text, no logos.
```

---

### B1 · Объект для блока безопасности · 1:1 · 2K
**Зачем:** объект-вырез на тёмной земле страницы; фон кадра = #0b0b0c, чтобы не было видно «коробки».

```
Create a high-end 3D product render, square 1:1. A blank payment card made of thick frosted glass with softly rounded corners, floating at a slight angle, a warm orange (#ff6a1f) glow trapped inside the glass and fading towards the edges, a thin polished metal edge catching a cool highlight. Soft studio lighting from above, subtle caustics, a faint shadow below. Isolated on a perfectly uniform seamless background in exactly #0b0b0c, object centred with generous empty space around. No text, no numbers, no chip, no logos.
```

---

### OG · og:image · 16:9 → 1200×630
Генерировать не нужно: взять принятый H1 и `intake.py --aspect 1200:630 --width 1200 --focus .65,.5`; название и строку — наложить в HTML-шаблоне или в редакторе.

---

## Обработка

```bash
S=.claude/skills/visual-prompter/scripts/intake.py
python3 $S gemini/*.png --sheet gemini/sheet.jpg
python3 $S gemini/h1.png --aspect 16:9 --width 2400 --grade night --grain .08 --out examples/selix/img/hero-street.webp
python3 $S gemini/c1.png --aspect 4:3  --width 1600 --grade night --grain .08 --out examples/selix/img/card-split.webp
python3 $S gemini/c4.png --aspect 2:3  --width 1000 --grade night --grain .08 --focus .5,.3 --out examples/selix/img/card-abandon.webp
python3 $S gemini/a1.png --aspect 1:1  --width 240  --grade night --out examples/selix/img/avatar-1.webp
python3 $S gemini/b1.png --aspect 1:1  --width 1200 --grade none  --out examples/selix/img/object-card.webp
python3 $S gemini/h1.png --aspect 1200:630 --width 1200 --grade night --focus .65,.5 --out examples/selix/img/og.jpg
```
