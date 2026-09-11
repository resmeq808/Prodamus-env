# Приёмы

22 приёма, снятых с разобранных сайтов. **На страницу берётся 3–5.** Больше — визуальный шум, и громкая вещь перестаёт читаться.

Каждый помечен архетипами, где он уместен: **A** постер · **B** свечение · **C** нарратив · **D** коллаж · **E** брутализм.

---

## Типографические

### 1. Экран-заявление · A
Первый экран — сплошной цвет и один объект. Ни оффера, ни списка услуг, ни кнопки. Jam Studio (274 ♥) начинается с красного поля и одного 3D-объекта; вся информация — во втором экране.

```css
.statement { min-height: 100svh; background: var(--accent); display: grid; place-items: center; }
```

### 2. Контурный текст · A C
```css
.hollow { color: transparent; -webkit-text-stroke: .02em var(--ink); paint-order: stroke fill; }
@media (max-width: 640px) { .hollow { -webkit-text-stroke-width: .03em; } }
```

### 3. Наложение слоёв · C
```html
<h1 class="stack"><span>ПОСЛЕ СМЕРТИ</span><span aria-hidden="true">ПОСЛЕ СМЕРТИ</span></h1>
```
```css
.stack { position: relative; }
.stack span + span { position: absolute; inset: 0; transform: translate(-.06em, .1em); opacity: .55; color: var(--accent); }
```

### 4. Глиф-обои · A
```css
.glyph-bg { position: absolute; inset-block-start: -.2em; inset-inline-start: -.05em;
  font-size: 40vw; line-height: .7; color: var(--accent); z-index: 0; pointer-events: none; user-select: none; }
.glyph-bg + * { position: relative; z-index: 1; }
```

### 5. Обрезка краем · A B
```css
.bleed { overflow: hidden; }
.bleed h2 { font-size: 22vw; white-space: nowrap; margin-inline-start: -.08em; }
```

### 6. Justify гигантским кеглем · A
```css
.justify-xl { text-align: justify; font-size: clamp(1.5rem, 4vw, 3.25rem); line-height: 1.15; }
.justify-xl :is(img, svg) { height: .8em; vertical-align: -.08em; margin-inline: .1em; }
```
Работает только на 3–5 строках. На длинном тексте превращается в «дыры».

---

## Плоскостные

### 7. Наклейка-бейдж · A D
Три штуки максимум, три разных угла, три разных цвета.

```css
.sticker { display: inline-block; padding: .35em .8em; border-radius: 999px;
  font: 700 var(--fs-meta)/1 var(--font-mono); text-transform: uppercase; letter-spacing: .06em;
  background: var(--accent); color: var(--ink); rotate: -6deg; }
.sticker:nth-of-type(2) { rotate: 4deg;  background: var(--noise); }
.sticker:nth-of-type(3) { rotate: -2deg; background: var(--ink); color: var(--ground); }
@media (max-width: 640px) { .sticker { rotate: none; } }
```

### 8. Рваный край · A
```css
.torn { --t: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 40' preserveAspectRatio='none'%3E%3Cpath d='M0,40 L0,18 C120,2 200,34 320,20 C460,4 560,30 700,16 C840,2 960,28 1080,14 L1200,20 L1200,40 Z' fill='%23000'/%3E%3C/svg%3E");
  -webkit-mask-image: var(--t); mask-image: var(--t); mask-size: 100% 100%; }
```
Проще и надёжнее: положить SVG-волну абсолютным элементом на стык двух секций, залив её цветом нижней секции.

### 9. Перечёркивание · A
Повторяющееся слово, положенное крест-накрест поверх изображения (Jam Studio).
```css
.cross { position: absolute; inset: 0; display: grid; place-items: center; overflow: hidden; }
.cross span { position: absolute; white-space: nowrap; color: var(--accent);
  font: 900 clamp(1rem,3vw,2rem)/1 var(--font-display); }
.cross span:first-child { rotate: -28deg; } .cross span:last-child { rotate: 28deg; }
```

### 10. Инверсия одной карточки · E A
```css
.cards > :nth-child(2) { background: var(--accent); color: var(--ground); }
```
Одна из трёх, никогда не две.

### 11. Бенто из логотипов · A D
Партнёров показывают не серой лентой, а сеткой белых карточек на тёмной земле (Слово-на-Дону).
```css
.bento { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 2px; background: var(--ink); }
.bento > * { background: var(--ground); display: grid; place-items: center; aspect-ratio: 16/9; padding: 1.5rem; }
```

### 12. Табло-цифры · D
```css
.board { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); }
.board dt { font: 900 clamp(3rem,8vw,7rem)/.85 var(--font-display); }
.board dd { font: var(--fs-meta)/1.3 var(--font-mono); text-transform: uppercase; letter-spacing: .08em; margin: .5rem 0 0; }
```

---

## Световые (только B)

### 13. Blur-свечение
```css
.glow { position: relative; isolation: isolate; overflow: hidden; background: var(--ground); }
.glow::before { content: ""; position: absolute; z-index: -1;
  inline-size: 60vmax; block-size: 60vmax; inset-block-start: -20vmax; inset-inline-start: 10%;
  background: radial-gradient(circle, var(--glow-a), transparent 65%);
  filter: blur(120px); opacity: .75; }
```
Черноты должно оставаться не меньше 40% экрана. Цвет свечения можно менять от секции к секции — это единственный архетип, где так можно.

### 14. Стеклянная карточка
```css
.glass { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
  border-radius: 20px; backdrop-filter: blur(16px); }
```

### 15. Карточка поверх градиента
Тёмный скруглённый прямоугольник кладётся на цветную градиентную плашку (Rassvet.Award: карточки «25 мая / 26 июля» поверх маджентового свечения). Даёт глубину без теней.

---

## Движение

### 16. Тикер
```css
.ticker { overflow: hidden; white-space: nowrap; border-block: 1px solid currentColor; padding-block: .6rem; }
.ticker__track { display: inline-flex; gap: 2rem; animation: slide 24s linear infinite; }
@keyframes slide { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .ticker__track { animation: none; } }
```
Содержимое дублируется в разметке дважды. Разделитель — `//` (Jam Studio) или `→` (Plavno), не «•».

### 17. Scroll-reveal
```css
@media (prefers-reduced-motion: no-preference) {
  .reveal { animation: rise linear both; animation-timeline: view(); animation-range: entry 5% cover 30%; }
  @keyframes rise { from { opacity: 0; translate: 0 2rem; } }
}
```
Один тип появления на всю страницу. Разные анимации у разных блоков читаются как несделанная работа.

### 18. Предметный интерактив · C
Кубик, который бросают; переключатель, меняющий сцену; мини-игра. Тайны Хокинса (374 ♥) и Бабули (265 ♥) держатся на этом. Всегда должен быть смысловой, а не декоративный: объект принадлежит истории.

### 19. Фоновое видео
```html
<video autoplay muted loop playsinline poster="poster.jpg" preload="metadata"></video>
```
На мобильном заменяется постером: `@media (max-width: 640px) { video { display: none; } .poster { display: block; } }`

---

## Фактурные

### 20. Мета-подписи в углах · A E
```css
.card { position: relative; }
.card::after { content: attr(data-meta); position: absolute; inset-block-end: .75rem; inset-inline-end: .75rem;
  font: var(--fs-meta)/1 var(--font-mono); text-transform: uppercase; letter-spacing: .08em; opacity: .6; }
```
`// tilda`, `// 2025`, `(01)`, `#хэштег`. Самая выгодная деталь по соотношению усилие/эффект.

### 21. Зерно
```css
body::after { content: ""; position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: .04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
```
Только на тёмной земле (архетипы B, C) и не выше `opacity: .06`.

### 22. Пунктир-маршрут · D
SVG-путь с `stroke-dasharray`, проходящий между секциями и связывающий коллаж (Сытый Бабр). Рисуется абсолютным слоем поверх, `pointer-events: none`.

---

## Чего нет ни на одном из 13 сайтов

Градиентные кнопки · карусели отзывов · иконки в кружочках · плоские стоковые иллюстрации · параллакс на всём подряд · «доверие» логотипами в серой ленте · счётчики, крутящиеся при скролле · модальные окна при входе · анимация появления у каждого элемента по отдельности.
