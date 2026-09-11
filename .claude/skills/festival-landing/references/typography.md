# Типографика

## Три роли, не больше

| Роль | Что набирает | Кегль | Характер |
|---|---|---|---|
| **Дисплей** | заголовок первого экрана, названия секций, цифры, даты | 7–20vw в hero, 4–7vw в секциях | максимально характерная гарнитура — она и есть голос страницы |
| **Текст** | абзацы, описания, карточки | 16–20px, вводки 20–28px | нейтральный гротеск, задача — не мешать |
| **Мета-моно** | подписи, номера, теги, колонтитулы, метки в углах | 11–13px | uppercase, `letter-spacing: .08em` |

Мета-моно есть у 11 из 13 разобранных сайтов. Это самая дешёвая по усилиям и самая заметная по эффекту деталь: она расставляет ритм и сразу читается как «сделано дизайнером».

Четвёртая гарнитура не добавляется никогда. Если хочется разнообразия — бери другое начертание той же семьи.

---

## Что реально стоит на разобранных сайтах

| Сайт | Дисплей | Текст | Мета |
|---|---|---|---|
| Сочный кейс | Simeiz (антиква) | Onest | JetBrains Mono |
| Курама | Sofia Sans Extra Condensed | — | Source Code Pro |
| СЫТЫЙ БАБР | Bebas Neue | Inter Tight / Manrope | — |
| Rassvet.Award | Sui | Sui | — |
| Rassvet.Award (акцент) | Nyght Serif (курсив) | | |
| Катерина Коэн | Vela Sans (узкое плотное) | Vela Sans | Vela Sans |
| Jam Studio | SexSmith | Involve | Involve |
| Адвент Kris Anf | Apohis (курсивная антиква) | Inter Tight | — |
| Plavno awards | Objects Sans | Objects Sans | — |
| Тайны Хокинса | Wix Madefor Display | Raleway | — |
| Бабули | Press Start 2P | Press Start 2P | — |
| Слово-на-Дону | Open Sans | Open Sans | — |

Вывод: половина проектов держится на **платных студийных гарнитурах** (Simeiz, Sui, Nyght, Apohis, SexSmith, Involve, Objects Sans, Vela Sans). Если бюджета на шрифт нет — бери замену из таблицы ниже и компенсируй кеглем и композицией. «Слово-на-Дону» с 76 ♥ набрано Open Sans: гарнитура не обязана быть редкой, если композиция сильная.

---

## Бесплатные гарнитуры с кириллицей

Все проверены по метаданным Google Fonts на наличие субсета `cyrillic`.

**Дисплей — плакатный крик**
`Dela Gothic One` (тяжёлый гротеск, лучший бесплатный «афишный») · `Oswald` · `Sofia Sans Extra Condensed` · `Sofia Sans Condensed` · `Alumni Sans` · `Unbounded` · `Tektur` (широкий техно) · `Roboto Condensed` · `Fira Sans Condensed`

**Дисплей — антиква с характером**
`Oranienbaum` · `Yeseva One` · `Playfair Display` (есть курсив) · `Cormorant Infant` (есть курсив) · `Forum` · `Ruslan Display`

**Дисплей — особые интонации**
`Pixelify Sans` и `Press Start 2P` (пиксель) · `Rampart One` (объём) · `Handjet` (переменный пиксель) · `Shantell Sans` (рукописный) · `Stalinist One` (конструктивизм)

**Текст**
`Inter Tight` · `Manrope` · `Onest` · `Golos Text` · `Geist` · `IBM Plex Sans` · `Raleway`

**Мета-моно**
`JetBrains Mono` · `IBM Plex Mono` · `Source Code Pro` · `Martian Mono` (широкий, очень «дизайнерский») · `Geist Mono` · `PT Mono`

### Ловушка

**У `Bebas Neue` в Google Fonts нет кириллицы**, хотя её ставят на русские сайты постоянно (на «Сытом Бабре» стоит отдельная кириллическая версия). Если набираешь по-русски — бери `Oswald`, `Sofia Sans Condensed`, `Alumni Sans` или `Dela Gothic One`. То же касается `Anton`, `Archivo` и `Instrument Serif` — кириллицы нет.

Перед подключением любой гарнитуры проверь субсет:
`https://fonts.googleapis.com/css2?family=Имя&subset=cyrillic` — если ответ пустой или без `cyrillic`, кириллицы нет.

---

## Шкала

```css
--fs-display:  clamp(3rem,  13vw, 12rem);   /* hero */
--fs-h1:       clamp(2.5rem, 7vw,  6rem);   /* названия секций */
--fs-h2:       clamp(1.75rem, 4vw, 3.5rem);
--fs-lead:     clamp(1.125rem, 2vw, 1.75rem);
--fs-body:     clamp(1rem, 1.1vw, 1.125rem);
--fs-meta:     0.75rem;
```

Дисплейный кегль в hero **начинается от 7vw**. Ниже — это не фестивальный лендинг.

## Настройки, без которых дисплейный текст выглядит любительски

```css
.display {
  font-size: var(--fs-display);
  line-height: .86;            /* крупный кегль всегда плотнее единицы */
  letter-spacing: -.03em;      /* гротеск: минус; узкие — до -.05em */
  text-transform: uppercase;   /* для архетипов A и D */
  text-wrap: balance;
  hyphens: none;
}
.meta {
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  text-transform: uppercase;
  letter-spacing: .08em;       /* мелкий кегль всегда разрежен */
}
```

Правило: **чем крупнее кегль, тем плотнее интерлиньяж и трекинг; чем мельче — тем разреженнее.** Дефолтный `line-height: 1.5` на заголовке в 12rem — самый заметный признак вёрстки без дизайнера.

---

## Типографические приёмы из разбора

1. **Имя во всю ширину до полей** (Катерина Коэн). Подбирается `font-size` так, чтобы строка касалась обоих полей. Надёжнее всего — SVG с `textLength`, но и `clamp()` с ручной подгонкой работает.
2. **Контурный текст** (Курама). `-webkit-text-stroke: 2px currentColor; color: transparent;` Проверь на мобильном: тонкая обводка на мелком кегле исчезает.
3. **Наложение слоёв** (Жизнь после смерти). Два `<span>` с одинаковым текстом, второй сдвинут `translate(-.08em,.12em)` и полупрозрачен.
4. **Обрезка краем экрана** (Plavno). Заголовок шире вьюпорта, `overflow: hidden` на секции — видна только часть букв.
5. **Гигантский глиф-обои** (Слово-на-Дону). Одна буква или цифра, `font-size: 40vw`, `position: absolute`, `z-index: 0`, акцентным цветом.
6. **Justify гигантским кеглем** (Сочный кейс). `text-align: justify` на абзаце в 3–4rem даёт рваные межсловные пробелы — это и есть приём. Внутрь строк вставляются эмодзи и иконки.
7. **Гротеск + курсивная антиква в одной строке** (Rassvet.Award). `Спектрум & <em>Rassvet.award</em>` — контраст характеров в пределах одного заголовка.
8. **Цифры кеглем заголовка** (Слово-на-Дону, AffArts). «35+», «50+», «10/09/08/01» набираются так же крупно, как названия секций.
