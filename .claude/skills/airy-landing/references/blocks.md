# Блоки

> **Сначала `art-direction.md`.** Hero и «вау»-секции в стиле доски (кадр в панели, гигант лесенкой, стекло, фото-карточки, светлый лист, финал-панель) собраны в `assets/starter.html` и разобраны в `art-direction.md`. Здесь — утилитарные секции (шапка, логотипы, фича, бенто, строки, цифры, цитата, галерея, шаги, тарифы, FAQ, подвал) в спокойной базе: берите их и перекрашивайте под выбранное направление — фото вместо серых плашек, микро-слой `.hud-row` над секцией, `.cta-pair` вместо обычной кнопки.

Каталог секций, из которых собирается страница. У каждого блока — когда брать, у кого подсмотрено, готовый HTML и CSS. Все стили опираются на `assets/tokens.css`: `.wrap`, `.section`, `.t-*`, `.btn`, `.media`.

Правило сборки: **на странице 8–12 секций и минимум 5 разных семейств компоновки.** Одно семейство (например, «сетка карточек») — не больше двух раз.

```
СЕМЕЙСТВА
A  центр          — текст по центру, медиа во всю ширину под ним
B  сплит          — текст слева, медиа справа (или наоборот)
C  широкий кадр   — одно медиа от края до края или inset-панель
D  сетка          — карточки, бенто, логотипы
E  список         — строки с линиями, аккордеон, таблица
F  типографика    — один крупный текст: цитата, манифест, число
```

---

## Содержание

1. Шапка
2. Hero: центр + продукт во всю ширину — A
3. Hero: сплит — B
4. Hero: inset-панель с фото или видео — C
5. Hero: типографский, у левого края — F
6. Hero: три колонки — B
7. Лента логотипов — D
8. Широкий кадр продукта — C
9. Фича с липким заголовком — B/E
10. Бенто — D
11. Строки-преимущества — E
12. Цифры — F/D
13. Большая цитата — F
14. Горизонтальная галерея — C
15. Шаги — E
16. Тарифы — D
17. FAQ — E
18. Финальный CTA — C
19. Подвал с большим логотипом

---

## 1. Шапка

64–80px высотой (медиана выборки 78px, у самых аккуратных — 64–72px). Липкая, полупрозрачная с размытием, линия снизу появляется только после начала скролла. Логотип слева, 4–6 пунктов меню, справа «Войти» текстом и одна кнопка.

Две раскладки: меню сразу после логотипа (Stripe, Vercel, Linear) — плотнее и современнее; меню по центру (Raycast, Mercury) — спокойнее.

```html
<header class="nav" data-nav>
  <div class="wrap nav__in">
    <a class="nav__logo" href="/" aria-label="Бренд — на главную">Бренд</a>
    <nav class="nav__menu" aria-label="Основное">
      <a href="#product">Продукт</a><a href="#pricing">Тарифы</a><a href="#customers">Клиенты</a><a href="#docs">Документация</a>
    </nav>
    <div class="nav__act">
      <a class="nav__login" href="/login">Войти</a>
      <a class="btn btn--primary btn--sm" href="/signup">Начать бесплатно</a>
    </div>
  </div>
</header>
```

```css
.nav { position: sticky; top: 0; z-index: 50; height: var(--nav-h);
       background: color-mix(in oklab, var(--bg) 80%, transparent);
       backdrop-filter: saturate(1.6) blur(14px); -webkit-backdrop-filter: saturate(1.6) blur(14px);
       border-bottom: 1px solid transparent; transition: border-color var(--dur-2); }
.nav.is-scrolled { border-bottom-color: var(--line); }
.nav__in { height: 100%; display: flex; align-items: center; gap: clamp(1.5rem, 3vw, 3rem); }
.nav__logo { font-family: var(--font); font-weight: var(--w-semi); font-size: 1.125rem; letter-spacing: -.02em; text-decoration: none; }
.nav__menu { display: flex; gap: clamp(1rem, 2vw, 2rem); font-size: var(--fs-small); }
.nav__menu a { text-decoration: none; color: var(--ink-2); }
.nav__menu a:hover { color: var(--ink); }
.nav__act { margin-inline-start: auto; display: flex; align-items: center; gap: 1.25rem; font-size: var(--fs-small); }
.nav__login { text-decoration: none; }
@media (max-width: 860px) { .nav__menu, .nav__login { display: none; } }
```

```js
const nav = document.querySelector('[data-nav]');
addEventListener('scroll', () => nav.classList.toggle('is-scrolled', scrollY > 8), { passive: true });
```

---

## 2. Hero: центр + продукт во всю ширину

Самая частая раскладка выборки (около половины SaaS): заголовок и подзаголовок по центру, две кнопки, под ними — большой кадр продукта шириной почти во весь экран, уходящий под сгиб. **Notion, Loom, Slack, Linear, Raycast, Airtable.**

Когда брать: цифровой продукт с красивым интерфейсом; бренд, у которого есть что показать.

```html
<section class="hero-c">
  <div class="wrap hero-c__text">
    <h1 class="t-hero">Приём платежей для&nbsp;онлайн-школ</h1>
    <p class="t-lead">Подключение за&nbsp;день, выплаты каждый день, без&nbsp;абонентской платы. Работает с&nbsp;вашей CRM и&nbsp;платформой курсов.</p>
    <div class="hero-c__cta">
      <a class="btn btn--primary btn--lg" href="/signup">Начать бесплатно</a>
      <a class="btn btn--ghost btn--lg" href="/demo">Записаться на&nbsp;демо</a>
    </div>
    <p class="t-meta">Без&nbsp;карты · 14 дней бесплатно</p>
  </div>
  <div class="wrap hero-c__shot">
    <div class="media media--edge ph" style="aspect-ratio: 16/9">[скриншот продукта, 2400×1350]</div>
  </div>
</section>
```

```css
.hero-c { padding-block: clamp(4rem, 3rem + 6vw, 9rem) 0; text-align: center; overflow: clip; }
.hero-c__text { display: grid; justify-items: center; gap: var(--space-5); }
.hero-c__text .t-hero { max-width: 16ch; }
.hero-c__text .t-lead { max-width: 44ch; }
.hero-c__cta { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-3); margin-top: var(--space-2); }
.hero-c__shot { margin-top: clamp(3rem, 2rem + 4vw, 6rem); }
.hero-c__shot .media { border-radius: var(--r-lg) var(--r-lg) 0 0; box-shadow: var(--shadow-3); }
```

Деталь: кадр продукта обрезан снизу секцией или растворяется градиентом в фон — `mask-image: linear-gradient(#000 70%, transparent)`. Так он не заканчивается «коробкой», а уходит в следующую секцию.

---

## 3. Hero: сплит

Текст слева (5–6 колонок), визуал справа (6–7 колонок), визуал часто вылезает за правое поле до края экрана. **Cal.com, Dropbox, Brex, Lemon Squeezy, Rippling, Betterment.**

Когда брать: визуал — предмет или интерфейс, который лучше смотрится крупно и сбоку; заголовок длиннее 6 слов.

```html
<section class="hero-s">
  <div class="hero-s__text">
    <h1 class="t-hero">Финансы, которые считаются сами</h1>
    <p class="t-lead">Карты, счета, расходы и&nbsp;закрывающие документы в&nbsp;одном месте. Для&nbsp;команд от&nbsp;5 до&nbsp;500 человек.</p>
    <form class="hero-s__form" action="/signup">
      <label class="sr-only" for="hs-email">Рабочая почта</label>
      <input id="hs-email" type="email" autocomplete="email" placeholder="Рабочая почта" required>
      <button class="btn btn--accent" type="submit">Открыть счёт</button>
    </form>
  </div>
  <div class="hero-s__media media ph">[фото карты и телефона, 1600×1400]</div>
</section>
```

```css
.hero-s { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); align-items: center;
          gap: clamp(2rem, 4vw, 5rem); min-height: min(88svh, 920px);
          padding-inline-start: max(var(--gutter), (100% - var(--max)) / 2); }   /* текст по полю, медиа до края */
.hero-s__text { display: grid; gap: var(--space-5); padding-block: var(--space-8); }
.hero-s__media { align-self: stretch; border-radius: var(--r-lg) 0 0 var(--r-lg); min-height: 420px; }
.hero-s__form { display: flex; gap: var(--space-2); max-width: 30rem; margin-top: var(--space-2); }
.hero-s__form input { flex: 1; min-width: 0; height: var(--btn-h); padding-inline: 1rem; border-radius: var(--r-pill);
                      border: 1px solid var(--line-2); background: var(--bg); }
.hero-s__form input:focus-visible { outline-offset: 0; border-color: var(--accent); }
@media (max-width: 900px) {
  .hero-s { grid-template-columns: 1fr; padding-inline: var(--gutter); min-height: 0; }
  .hero-s__media { border-radius: var(--r-md); min-height: 320px; }
  .hero-s__form { flex-direction: column; }
}
```

Приём «поле почты + кнопка» в hero — у Mercury, Brex, Kraken, Rippling, Asana. Работает, когда регистрация действительно начинается с почты.

---

## 4. Hero: inset-панель

Hero — большая скруглённая панель с полями 8–16px от краёв окна, внутри — фото, видео или цветная земля. Страница вокруг остаётся белой. Главный приём последних двух лет: выглядит и «во всю ширину», и аккуратно. **Monzo, Klarna, Railway, Retool, Readwise, Cal.com, Mercury, Kraken.**

Когда брать: есть сильное фото или видео; нужно ощущение продукта-объекта; финтех, потребительский продукт, отель.

```html
<section class="hero-i">
  <div class="hero-i__panel">
    <img class="hero-i__bg" src="hero.avif" alt="" width="2400" height="1400" fetchpriority="high">
    <div class="hero-i__text">
      <h1 class="t-hero">Тратьте деньги на&nbsp;жизнь, а&nbsp;не&nbsp;жизнь на&nbsp;деньги</h1>
      <p class="t-lead">Зарплата сама раскладывается по&nbsp;копилкам, сдача превращается в&nbsp;сбережения.</p>
      <a class="btn btn--on-dark btn--lg" href="/open">Открыть счёт бесплатно</a>
    </div>
  </div>
</section>
```

```css
.hero-i { padding: clamp(.5rem, 1vw, 1rem); padding-top: 0; }
.hero-i__panel { position: relative; isolation: isolate; overflow: hidden; border-radius: var(--r-lg);
                 min-height: calc(100svh - var(--nav-h) - 1rem); display: grid; align-items: end;
                 background: var(--dark); color: var(--on-dark); }
.hero-i__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; }
.hero-i__panel::after { content: ""; position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(180deg, transparent 35%, rgb(0 0 0 / .55) 100%); }   /* скрим под текстом */
.hero-i__text { display: grid; gap: var(--space-5); justify-items: start;
                padding: clamp(1.5rem, 5vw, 5rem); max-width: 52rem; }
.hero-i__text .t-lead { color: var(--on-dark-2); }
```

Детали: радиус панели 20–32px; скрим только под текстом, а не по всему кадру; если внизу стоит полоса бейджей или цифр, она лежит внутри панели.

---

## 5. Hero: типографский, у левого края

Огромный заголовок 96–140px от левого поля, почти без картинок. Сила — в масштабе и воздухе. **Asana, Maze, Levels, Pitch, Wise (капс), Webflow.**

Когда брать: студия, бренд с сильной интонацией, продукт, который трудно показать картинкой. Только если заголовок 2–5 слов.

```html
<section class="hero-t">
  <div class="wrap">
    <h1 class="t-display">Строим для&nbsp;того, что&nbsp;будет дальше</h1>
    <div class="hero-t__row">
      <p class="t-lead">Сайты, которые продают: от&nbsp;стратегии до&nbsp;запуска и&nbsp;поддержки. Двенадцать лет, сорок человек, один стандарт.</p>
      <div class="hero-t__cta">
        <a class="btn btn--primary btn--lg" href="/brief">Обсудить проект</a>
        <a class="link-arrow" href="/work">Смотреть работы <span class="arr" aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</section>
```

```css
.hero-t { padding-block: clamp(5rem, 3rem + 8vw, 11rem) var(--section-s); }
.hero-t .t-display { max-width: 12ch; }
.hero-t__row { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--col-gap);
               margin-top: clamp(2.5rem, 2rem + 3vw, 5rem); align-items: end; }
.hero-t__row .t-lead { grid-column: 1 / span 5; }
.hero-t__cta { grid-column: 8 / -1; display: flex; flex-wrap: wrap; gap: var(--space-5); align-items: center; justify-content: flex-end; }
@media (max-width: 860px) { .hero-t__row > * { grid-column: 1 / -1 !important; justify-content: flex-start; } }
```

---

## 6. Hero: три колонки

Заголовок слева, визуал по центру, короткое описание и кнопка справа. Использует всю ширину экрана и сразу выглядит «широко». **Vercel, Cash App.**

```html
<section class="hero-3">
  <div class="wrap hero-3__in">
    <h1 class="t-hero">Деньги так, как&nbsp;они должны работать</h1>
    <div class="hero-3__media media ph" style="aspect-ratio: 9/16">[экран приложения]</div>
    <div class="hero-3__side">
      <p class="t-body">От&nbsp;зарплаты до&nbsp;инвестиций — управляйте деньгами в&nbsp;одном приложении, без&nbsp;комиссий за&nbsp;переводы.</p>
      <a class="btn btn--primary" href="/app">Скачать приложение</a>
    </div>
  </div>
</section>
```

```css
.hero-3__in { display: grid; grid-template-columns: 1fr minmax(260px, 380px) 1fr; gap: clamp(1.5rem, 4vw, 5rem);
              align-items: center; min-height: min(86svh, 900px); padding-block: var(--space-8); }
.hero-3__side { display: grid; gap: var(--space-5); justify-items: start; max-width: 30ch; justify-self: end; }
.hero-3__media { border-radius: 36px; box-shadow: var(--shadow-3); }
@media (max-width: 960px) { .hero-3__in { grid-template-columns: 1fr; } .hero-3__side { justify-self: start; } .hero-3__media { max-width: 320px; } }
```

---

## 7. Лента логотипов

Сразу под hero, почти у всех SaaS и финтехов выборки. 5–8 логотипов, монохромно, одной оптической высоты, одна короткая подпись. Если логотипов больше 8 — бегущая строка (одна на страницу).

```html
<section class="logos section--s" aria-label="Клиенты">
  <div class="wrap logos__in">
    <p class="t-meta">Нам доверяют больше 12&nbsp;000 компаний</p>
    <ul class="logos__row" role="list">
      <li><img src="logo-1.svg" alt="Компания 1" height="28"></li>
      <!-- 5–8 логотипов -->
    </ul>
  </div>
</section>
```

```css
.logos__in { display: grid; gap: var(--space-6); justify-items: center; text-align: center; }
.logos__row { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: clamp(1.5rem, 4vw, 4rem); }
.logos__row img { height: 26px; width: auto; filter: grayscale(1); opacity: .7; transition: opacity var(--dur-1); }
.logos__row img:hover { opacity: 1; }
```

Для бегущей строки: `@keyframes marquee { to { transform: translateX(-50%) } }`, дублированный ряд, `mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)` по краям, пауза на `:hover` и при `prefers-reduced-motion`.

---

## 8. Широкий кадр продукта

Одно изображение или видео от края до края (`.bleed`) или в inset-панели, над ним — короткий заголовок. Это «вдох» между плотными секциями. У 40–50% сайтов выборки есть хотя бы одно медиа шире 97% экрана.

```html
<section class="section wide">
  <div class="wrap wide__head">
    <h2 class="t-h2">Все платежи на&nbsp;одном экране</h2>
    <p class="t-lead">Оплаты, возвраты, подписки и&nbsp;выплаты партнёрам — в&nbsp;реальном времени.</p>
  </div>
  <div class="inset">
    <div class="media wide__media ph" style="aspect-ratio: 21/9">[видео интерфейса, 2880×1234, muted loop]</div>
  </div>
</section>
```

```css
.wide__head { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--col-gap); align-items: end; margin-bottom: clamp(2rem, 4vw, 4rem); }
.wide__head .t-h2 { grid-column: 1 / span 6; }
.wide__head .t-lead { grid-column: 8 / -1; }
.wide__media { border-radius: var(--r-lg); }
@media (max-width: 860px) { .wide__head > * { grid-column: 1 / -1 !important; } .wide__media { aspect-ratio: 4/3 !important; } }
```

Видео: `<video autoplay muted loop playsinline preload="metadata" poster="…">`, без звука, без контролов, на мобильном — постер.

---

## 9. Фича с липким заголовком

Слева заголовок и описание прилипают при скролле, справа проходит 2–4 кадра. Главный способ рассказать о нескольких возможностях без зигзага. **Linear, Stripe, Attio.**

```html
<section class="section feat">
  <div class="wrap feat__in">
    <div class="feat__side">
      <h2 class="t-h2">Всё, что нужно для&nbsp;продаж</h2>
      <p class="t-body">Страницы оплаты, подписки, рассрочка и&nbsp;чеки. Подключаются за&nbsp;минуты, работают без&nbsp;программиста.</p>
      <a class="link-arrow" href="/features">Все возможности <span class="arr" aria-hidden="true">→</span></a>
    </div>
    <div class="feat__list">
      <figure class="feat__item">
        <div class="media ph" style="aspect-ratio: 4/3">[экран: страница оплаты]</div>
        <figcaption><b>Страница оплаты за&nbsp;минуту.</b> Без&nbsp;сайта и&nbsp;программиста — ссылка готова сразу.</figcaption>
      </figure>
      <!-- ещё 2–3 -->
    </div>
  </div>
</section>
```

```css
.feat__in { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(2rem, 6vw, 7rem); align-items: start; }
.feat__side { position: sticky; top: calc(var(--nav-h) + 3rem); display: grid; gap: var(--space-5); justify-items: start; }
.feat__list { display: grid; gap: clamp(3rem, 6vw, 6rem); }
.feat__item { display: grid; gap: var(--space-4); }
.feat__item figcaption { color: var(--ink-2); max-width: 48ch; }
.feat__item figcaption b { color: var(--ink); font-weight: var(--w-medium); }
@media (max-width: 900px) { .feat__in { grid-template-columns: 1fr; } .feat__side { position: static; } }
```

Приём подписи: первое предложение — жирнее и тоном `--ink`, продолжение — `--ink-2`. Так подпись и заголовок карточки становятся одним абзацем.

---

## 10. Бенто

Сетка карточек **разного** размера. Карточек ровно столько, сколько пунктов; хотя бы две с настоящей картинкой, одна — во всю ширину или на две трети. **Apple, Linear, Framer, Raycast.**

```html
<section class="section">
  <div class="wrap">
    <h2 class="t-h2 bento__title">Работает с&nbsp;тем, что&nbsp;у&nbsp;вас уже есть</h2>
    <div class="bento">
      <article class="bento__card bento__card--xl">
        <div class="bento__text"><h3 class="t-h3">120+ интеграций</h3><p class="t-small">CRM, платформы курсов, конструкторы сайтов.</p></div>
        <div class="media ph">[сетка логотипов интеграций]</div>
      </article>
      <article class="bento__card"><h3 class="t-h3">API за&nbsp;вечер</h3><p class="t-small">Документация с&nbsp;примерами на&nbsp;пяти языках.</p></article>
      <article class="bento__card bento__card--tall">…</article>
      <article class="bento__card bento__card--dark">…</article>
      <article class="bento__card">…</article>
    </div>
  </div>
</section>
```

```css
.bento__title { margin-bottom: clamp(2rem, 4vw, 4rem); }
.bento { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); grid-auto-rows: minmax(220px, auto); gap: var(--space-3); }
.bento__card { grid-column: span 2; display: grid; align-content: space-between; gap: var(--space-5);
               padding: clamp(1.25rem, 2vw, 2rem); border-radius: var(--r-md); background: var(--bg-2); overflow: hidden; }
.bento__card--xl { grid-column: span 4; grid-row: span 2; }
.bento__card--tall { grid-row: span 2; }
.bento__card--dark { background: var(--dark); color: var(--on-dark); }
.bento__card--dark .t-small { color: var(--on-dark-2); }
.bento__card .media { border-radius: calc(var(--r-md) - 8px); }
@media (max-width: 900px) { .bento { grid-template-columns: 1fr 1fr; } .bento__card, .bento__card--xl { grid-column: span 2; grid-row: auto; } }
```

Карточки держатся на смене фона (`--bg-2`), без рамок и без теней.

---

## 11. Строки-преимущества

Заголовок слева, справа — список строк, разделённых линиями 1px. Спокойнее карточек и выглядит дороже. **Stripe, Vercel, Dата-Поинт.**

```html
<section class="section">
  <div class="wrap rows">
    <h2 class="t-h2">Почему школы переходят к&nbsp;нам</h2>
    <dl class="rows__list">
      <div class="rows__item"><dt class="t-h4">Выплаты каждый день</dt><dd class="t-body">Деньги приходят на&nbsp;счёт на&nbsp;следующий рабочий день, без&nbsp;минимальной суммы.</dd></div>
      <div class="rows__item"><dt class="t-h4">Комиссия от&nbsp;2,9%</dt><dd class="t-body">Без&nbsp;абонентской платы и&nbsp;платы за&nbsp;подключение.</dd></div>
      <div class="rows__item"><dt class="t-h4">Чеки по&nbsp;54-ФЗ</dt><dd class="t-body">Онлайн-касса встроена, чеки уходят покупателю автоматически.</dd></div>
    </dl>
  </div>
</section>
```

```css
.rows { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(2rem, 6vw, 7rem); }
.rows__list { border-top: 1px solid var(--line); }
.rows__item { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); gap: var(--space-5);
              padding-block: clamp(1.25rem, 2vw, 2rem); border-bottom: 1px solid var(--line); }
@media (max-width: 900px) { .rows, .rows__item { grid-template-columns: 1fr; } .rows__item { gap: var(--space-2); } }
```

---

## 12. Цифры

3–4 показателя, крупно (48–80px), вес 400–500, подпись 3–6 слов. Без карточек — разделители или просто воздух. Цифры только настоящие.

```html
<section class="section--s">
  <div class="wrap stats">
    <div class="stat"><p class="stat__value">12&nbsp;000+</p><p class="t-small">школ и&nbsp;экспертов</p></div>
    <div class="stat"><p class="stat__value">1 день</p><p class="t-small">от&nbsp;заявки до&nbsp;первой оплаты</p></div>
    <div class="stat"><p class="stat__value">99,98%</p><p class="t-small">доступность за&nbsp;год</p></div>
    <div class="stat"><p class="stat__value">24/7</p><p class="t-small">поддержка живыми людьми</p></div>
  </div>
</section>
```

```css
.stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--col-gap); border-top: 1px solid var(--line); }
.stat { display: grid; gap: var(--space-2); padding-top: var(--space-5); }
.stat__value { font-family: var(--font); font-size: clamp(2.5rem, 1.6rem + 3vw, 4.5rem); font-weight: var(--w-regular);
               line-height: 1; letter-spacing: -.035em; }
@media (max-width: 760px) { .stats { grid-template-columns: 1fr 1fr; row-gap: var(--space-7); } }
```

---

## 13. Большая цитата

Один отзыв на всю ширину, кеглем заголовка (28–44px), с фото и подписью. Сильнее карусели из десяти мелких.

```html
<section class="section">
  <figure class="wrap quote">
    <blockquote class="quote__text">«Перешли за&nbsp;один вечер. Через месяц забыли, что&nbsp;платежи — это&nbsp;отдельная задача».</blockquote>
    <figcaption class="quote__who">
      <img src="face.jpg" alt="" width="48" height="48">
      <span><b>Имя Фамилия</b><br><span class="tone-3">Основатель, Название школы</span></span>
    </figcaption>
  </figure>
</section>
```

```css
.quote { display: grid; gap: var(--space-7); }
.quote__text { font-family: var(--font); font-size: clamp(1.75rem, 1.1rem + 2.2vw, 3rem); line-height: 1.15; letter-spacing: -.025em;
               font-weight: var(--w-regular); max-width: 28ch; text-indent: -.4em; }  /* висячая кавычка */
.quote__who { display: flex; gap: var(--space-4); align-items: center; font-size: var(--fs-small); }
.quote__who img { border-radius: 50%; }
```

---

## 14. Горизонтальная галерея

Ряд карточек, уходящий за правый край экрана, листается свайпом и колесом. Хорош для кейсов, товаров, номеров отеля. Начинается от поля, заканчивается у края окна.

```html
<section class="section">
  <div class="wrap gal__head"><h2 class="t-h2">Номера</h2><a class="link-arrow" href="/rooms">Все номера <span class="arr">→</span></a></div>
  <ul class="gal" role="list">
    <li class="gal__item"><div class="media ph" style="aspect-ratio: 4/5">[фото номера]</div><p class="t-h4">Люкс с&nbsp;террасой</p><p class="t-small">от&nbsp;38&nbsp;000&nbsp;₽ за&nbsp;ночь</p></li>
    <!-- 5–8 -->
  </ul>
</section>
```

```css
.gal__head { display: flex; justify-content: space-between; align-items: end; gap: var(--space-5); margin-bottom: var(--space-7); }
.gal { display: grid; grid-auto-flow: column; grid-auto-columns: clamp(260px, 28vw, 440px); gap: var(--space-4);
       overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
       padding-inline: max(var(--gutter), (100% - var(--max)) / 2); scroll-padding-inline: max(var(--gutter), (100% - var(--max)) / 2); }
.gal::-webkit-scrollbar { display: none; }
.gal__item { scroll-snap-align: start; display: grid; gap: var(--space-2); }
.gal__item .media { margin-bottom: var(--space-2); }
```

---

## 15. Шаги

Только если это правда последовательность. 3–4 шага в ряд, номер мелко, без кружков.

```html
<section class="section">
  <div class="wrap">
    <h2 class="t-h2 steps__title">Три шага до&nbsp;первой оплаты</h2>
    <ol class="steps" role="list">
      <li class="step"><span class="step__n t-meta">1</span><h3 class="t-h4">Регистрация</h3><p class="t-small">Почта и&nbsp;ИНН — пять минут.</p></li>
      <li class="step"><span class="step__n t-meta">2</span><h3 class="t-h4">Проверка</h3><p class="t-small">Банк проверяет документы за&nbsp;день.</p></li>
      <li class="step"><span class="step__n t-meta">3</span><h3 class="t-h4">Первая оплата</h3><p class="t-small">Отправьте ссылку клиенту.</p></li>
    </ol>
  </div>
</section>
```

```css
.steps__title { margin-bottom: clamp(2rem, 4vw, 4rem); }
.steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--col-gap); counter-reset: s; }
.step { display: grid; gap: var(--space-2); align-content: start; padding-top: var(--space-5); border-top: 1px solid var(--line-2); }
.step__n { margin-bottom: var(--space-5); }
```

---

## 16. Тарифы

2–3 карточки (четвёртая — «Корпоративный» строкой ниже), одна выделена тёмной землёй или акцентной обводкой, а не бейджем «Популярный» с градиентом. Цена крупно, период мелко, 4–6 пунктов, одна кнопка.

```html
<section class="section" id="pricing">
  <div class="wrap">
    <h2 class="t-h2 price__title">Платите только за&nbsp;продажи</h2>
    <div class="prices">
      <article class="price">
        <h3 class="t-h4">Старт</h3>
        <p class="price__value">0&nbsp;₽ <span class="t-small">в&nbsp;месяц</span></p>
        <p class="t-small">Комиссия 3,5% с&nbsp;оплаты</p>
        <ul class="price__list" role="list"><li>Страницы оплаты</li><li>Онлайн-касса</li><li>Выплаты раз в&nbsp;неделю</li></ul>
        <a class="btn btn--ghost" href="/signup?plan=start">Начать бесплатно</a>
      </article>
      <article class="price price--main">…</article>
      <article class="price">…</article>
    </div>
  </div>
</section>
```

```css
.price__title { margin-bottom: clamp(2rem, 4vw, 4rem); }
.prices { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-3); }
.price { display: grid; gap: var(--space-4); align-content: start; padding: clamp(1.5rem, 2.5vw, 2.5rem);
         border-radius: var(--r-md); background: var(--bg-2); }
.price--main { background: var(--dark); color: var(--on-dark); }
.price--main .t-small { color: var(--on-dark-2); }
.price__value { font-family: var(--font); font-size: clamp(2.25rem, 1.8rem + 1.5vw, 3.25rem); letter-spacing: -.03em; line-height: 1; }
.price__list { display: grid; gap: var(--space-2); padding-block: var(--space-4); border-top: 1px solid var(--line); font-size: var(--fs-small); }
.price--main .price__list { border-color: var(--line-dark); }
.price .btn { margin-top: auto; }
@media (max-width: 900px) { .prices { grid-template-columns: 1fr; } }
```

---

## 17. FAQ

Заголовок слева, аккордеон справа, на нативных `<details>`. 5–8 вопросов.

```html
<section class="section">
  <div class="wrap faq">
    <h2 class="t-h2">Частые вопросы</h2>
    <div class="faq__list">
      <details class="faq__item"><summary>Сколько стоит подключение?</summary><p class="t-body">Бесплатно. Платите только комиссию с&nbsp;каждой оплаты.</p></details>
      <!-- … -->
    </div>
  </div>
</section>
```

```css
.faq { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(2rem, 6vw, 7rem); }
.faq__list { border-top: 1px solid var(--line); }
.faq__item { border-bottom: 1px solid var(--line); }
.faq__item summary { display: flex; justify-content: space-between; gap: var(--space-5); padding-block: 1.375rem;
                     cursor: pointer; list-style: none; font-weight: var(--w-medium); font-size: 1.0625rem; }
.faq__item summary::-webkit-details-marker { display: none; }
.faq__item summary::after { content: "+"; font-weight: 300; font-size: 1.5rem; line-height: 1; color: var(--ink-3); transition: transform var(--dur-2) var(--ease-out); }
.faq__item[open] summary::after { transform: rotate(45deg); }
.faq__item p { padding-bottom: 1.5rem; }
@media (max-width: 900px) { .faq { grid-template-columns: 1fr; } }
```

---

## 18. Финальный CTA

Повтор главного действия той же формулировкой. Два варианта: inset-панель с тёмной или акцентной землёй во всю ширину, или просто крупный заголовок по центру с кнопкой и большим воздухом.

```html
<section class="cta">
  <div class="cta__panel">
    <h2 class="t-h2">Первая оплата&nbsp;— уже сегодня</h2>
    <p class="t-lead">Регистрация за&nbsp;пять минут. Без&nbsp;абонентской платы.</p>
    <div class="cta__btns"><a class="btn btn--on-dark btn--lg" href="/signup">Начать бесплатно</a><a class="btn btn--lg cta__ghost" href="/demo">Записаться на&nbsp;демо</a></div>
  </div>
</section>
```

```css
.cta { padding: calc(var(--section) / 2) clamp(.5rem, 1vw, 1rem) clamp(.5rem, 1vw, 1rem); }
.cta__panel { display: grid; justify-items: center; text-align: center; gap: var(--space-5);
              padding: clamp(4rem, 3rem + 7vw, 10rem) var(--gutter); border-radius: var(--r-lg);
              background: var(--dark); color: var(--on-dark); }
.cta__panel .t-lead { color: var(--on-dark-2); }
.cta__btns { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-3); margin-top: var(--space-3); }
.cta__ghost { border-color: var(--line-dark); color: var(--on-dark); }
.cta__ghost:hover { border-color: rgb(255 255 255 / .3); }
```

---

## 19. Подвал с большим логотипом

Колонки ссылок, внизу — название бренда гигантскими буквами на всю ширину экрана (`font-size` подбирается так, чтобы слово заняло ровно ширину). Модный и простой финальный аккорд. **Vercel, Framer-шаблоны, Woodpecker.**

```html
<footer class="foot">
  <div class="wrap foot__cols">
    <div><p class="t-h4">Бренд</p><p class="t-small">ООО «Бренд», ИНН 0000000000</p></div>
    <nav aria-label="Продукт"><p class="t-meta">Продукт</p><a href="#">Возможности</a><a href="#">Тарифы</a><a href="#">API</a></nav>
    <nav aria-label="Компания"><p class="t-meta">Компания</p><a href="#">О нас</a><a href="#">Блог</a><a href="#">Вакансии</a></nav>
    <nav aria-label="Помощь"><p class="t-meta">Помощь</p><a href="#">Документация</a><a href="mailto:hi@brand.ru">hi@brand.ru</a><a href="tel:+70000000000">+7 000 000-00-00</a></nav>
  </div>
  <p class="foot__word" aria-hidden="true">Бренд</p>
  <div class="wrap foot__legal t-meta"><span>© 2026 Бренд</span><a href="/privacy">Политика конфиденциальности</a></div>
</footer>
```

```css
.foot { padding-top: var(--section-s); background: var(--bg); border-top: 1px solid var(--line); overflow: clip; }
.foot__cols { display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: var(--col-gap); }
.foot__cols nav { display: grid; gap: var(--space-2); align-content: start; font-size: var(--fs-small); }
.foot__cols nav a { text-decoration: none; color: var(--ink-2); }
.foot__cols nav a:hover { color: var(--ink); }
.foot__word { font-family: var(--font); font-weight: var(--w-semi); font-size: 23vw; line-height: .78; letter-spacing: -.06em;
              text-align: center; color: var(--bg-2); margin-block: var(--space-8) calc(-0.08 * 23vw); user-select: none; }
.foot__legal { display: flex; justify-content: space-between; gap: var(--space-5); padding-block: var(--space-5); border-top: 1px solid var(--line); position: relative; }
@media (max-width: 760px) { .foot__cols { grid-template-columns: 1fr 1fr; } }
```

`font-size` у `.foot__word` подгоняется под длину слова: для 5–6 букв — около 22–24vw, для 8–9 букв — 15–16vw.
