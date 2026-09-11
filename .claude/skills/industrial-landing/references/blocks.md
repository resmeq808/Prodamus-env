# Каталог блоков

Страница собирается отсюда. Все классы опираются на токены из `assets/tokens.css`.

Порядок блоков на типовой странице: 1 → 2 → 3 → 4 → 6 → 7 → 8/9/10 → 11 → 14 → 16 → 17 → 18 → 19 → 20.

---

## 1. Шапка

Прозрачная поверх hero, при скролле — залитая. Телефон и кнопка видны всегда.

```html
<header class="hdr" id="hdr">
  <div class="wrap hdr__in">
    <a class="hdr__logo" href="/">ЛОГОТИП</a>
    <nav class="hdr__nav">
      <a href="#dirs">Направления</a><a href="#steps">Этапы</a>
      <a href="#catalog">Каталог</a><a href="#faq">Вопросы</a><a href="#contacts">Контакты</a>
    </nav>
    <div class="hdr__act">
      <a class="hdr__tel" href="tel:+70000000000">+7 000 000-00-00</a>
      <a class="btn btn--primary btn--sm" href="#cta">Оставить заявку</a>
    </div>
  </div>
</header>
```
```css
.hdr { position: fixed; inset-block-start: 0; inset-inline: 0; z-index: 50;
       color: #fff; transition: background .25s, color .25s; }
.hdr.is-stuck { background: var(--ground); color: var(--ink);
                border-block-end: 1px solid var(--line); box-shadow: 0 1px 20px rgb(0 0 0/.06); }
.hdr__in { display: flex; align-items: center; gap: 2rem; padding-block: 1rem; }
.hdr__nav { display: flex; gap: 1.5rem; margin-inline-start: auto; font-size: var(--fs-small); }
.hdr__nav a { text-decoration: none; opacity: .85; }
.hdr__nav a:hover { opacity: 1; }
.hdr__act { display: flex; align-items: center; gap: 1rem; }
.hdr__tel { font-size: var(--fs-body); font-weight: 500; text-decoration: none; white-space: nowrap; }
@media (max-width: 900px) { .hdr__nav, .hdr__tel { display: none; } }
```
```js
addEventListener('scroll', () => hdr.classList.toggle('is-stuck', scrollY > 40), {passive:true});
```

---

## 2. HERO

Эталон жанра (Propoly, Дата-Поинт, Siding, Главный Путь). Тёмное фото на всю ширину, заголовок-факт слева, три пункта справа, две кнопки.

```html
<section class="hero">
  <img class="hero__bg" src="shop.webp" alt="" fetchpriority="high" width="2400" height="1350">
  <div class="wrap hero__in">
    <div class="hero__main">
      <h1 class="hero__title">Промышленные полы под ключ <span class="accent">для объектов с высокой нагрузкой</span></h1>
      <p class="hero__sub">Проектируем и выполняем промышленные полы для складов, производств,
         логистических центров и агропромышленных объектов. Работаем по ГОСТ и СНиП.</p>
      <div class="hero__btns">
        <a class="btn btn--primary" href="#cta">Рассчитать стоимость</a>
        <a class="btn btn--ghost" href="#cta">Отправить нам ТЗ</a>
      </div>
    </div>
    <ul class="hero__points">
      <li><span class="ico"><!-- svg 24 --></span><b>Бесплатный расчёт стоимости</b><i>за 24 часа</i></li>
      <li><span class="ico"><!-- svg 24 --></span><b>Выезд на объект</b><i>и оценка условий эксплуатации</i></li>
      <li><span class="ico"><!-- svg 24 --></span><b>Подбор технологии</b><i>под нагрузку, влажность и задачи бизнеса</i></li>
    </ul>
  </div>
</section>
```
```css
.hero { position: relative; min-height: 88svh; display: grid; align-items: end;
        padding-block: 9rem 3.5rem; color: #fff; background: var(--ground-dark); overflow: clip; }
.hero__bg { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; object-fit: cover; z-index: 0; }
.hero::after { content: ""; position: absolute; inset: 0; z-index: 1;
   background: linear-gradient(90deg, rgb(0 0 0/.82) 0%, rgb(0 0 0/.55) 55%, rgb(0 0 0/.35) 100%); }
.hero__in { position: relative; z-index: 2; display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,.85fr);
            gap: 3rem; align-items: end; }
.hero__title { font-size: var(--fs-hero); font-weight: 600; line-height: var(--lh-head);
               letter-spacing: -.01em; margin: 0 0 1rem; max-width: 18ch; text-wrap: balance; }
.hero__sub { font-size: var(--fs-body); line-height: var(--lh-body);
             color: rgb(255 255 255/.72); max-width: 52ch; margin: 0 0 2rem; }
.hero__btns { display: flex; flex-wrap: wrap; gap: .75rem; }
.hero__points { display: grid; gap: 1.5rem; }
.hero__points li { display: grid; grid-template-columns: 44px 1fr; grid-template-rows: auto auto;
                   column-gap: 1rem; align-items: start; }
.hero__points .ico { grid-row: 1/3; display: grid; place-items: center; inline-size: 44px; block-size: 44px;
                     border: 1px solid rgb(255 255 255/.25); border-radius: var(--r-md); }
.hero__points b { font-size: var(--fs-body); font-weight: 500; }
.hero__points i { font-style: normal; font-size: var(--fs-small); color: rgb(255 255 255/.6); }
@media (max-width: 900px) {
  .hero { min-height: auto; padding-block: 7rem 2.5rem; }
  .hero__in { grid-template-columns: minmax(0,1fr); gap: 2.5rem; }
  .hero__title { max-width: none; }
}
```

**Вариант с нумерованными плашками** (Главный Путь): вместо иконок — `01 / 02 / 03` в полупрозрачных плашках `background: rgb(255 255 255/.1); border-radius: var(--r-sm); padding: .9rem 1.1rem`.

---

## 3. Лента преимуществ

Идёт сразу под hero и по возможности влезает в первый экран (Дата-Поинт, Siding). Четыре короткие пары «что — уточнение», разделённые вертикальными линиями.

```html
<ul class="ribbon wrap">
  <li><b>Оперативная доставка</b><span>в любой регион России</span></li>
  <li><b>Бесплатная техническая консультация</b><span>инженера по подбору</span></li>
  <li><b>Только сертифицированная продукция</b><span>с полным пакетом документов</span></li>
  <li><b>Удобный каталог</b><span>с фильтрами и спецификациями</span></li>
</ul>
```
```css
.ribbon { display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem; padding-block: 1.75rem; }
.ribbon li + li { border-inline-start: 1px solid var(--line); padding-inline-start: 2rem; }
.ribbon b { display: block; font-size: var(--fs-small); font-weight: 500; }
.ribbon span { font-size: var(--fs-meta); color: var(--muted); }
@media (max-width: 900px) { .ribbon { grid-template-columns: 1fr 1fr; }
  .ribbon li:nth-child(odd) { border-inline-start: 0; padding-inline-start: 0; } }
```

---

## 4. Цифры

Одна плитка залита акцентом — приём из шести сайтов. Каждое число обязано иметь расшифровку.

```html
<section class="section">
  <div class="wrap nums">
    <div class="nums__head">
      <p class="meta meta--dot">цифры</p>
      <h2 class="h2">Цифры, за которыми стоит практический опыт</h2>
      <a class="btn btn--ghost btn--sm" href="#cta">Связаться с нами</a>
    </div>
    <dl class="nums__grid">
      <div class="num"><dt>8+</dt><dd><b>Лет опыта</b><span>в устройстве промышленных полов</span></dd></div>
      <div class="num"><dt>120+</dt><dd><b>Объектов</b><span>для бизнеса и производственных площадок</span></dd></div>
      <div class="num"><dt>15+</dt><dd><b>Единиц техники</b><span>для устройства, обработки и шлифовки</span></dd></div>
      <div class="num num--accent"><dt>450 000+</dt><dd><b>Квадратных метров</b><span>выполненных промышленных полов</span></dd></div>
    </dl>
  </div>
</section>
```
```css
.nums { display: grid; grid-template-columns: minmax(0,.8fr) minmax(0,1.2fr); gap: 3rem; align-items: start; }
.nums__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); margin: 0; }
.num { background: var(--surface); padding: 2rem 1.75rem; }
.num dt { font-size: var(--fs-num); font-weight: 500; line-height: 1; letter-spacing: -.02em; }
.num dd { margin: .9rem 0 0; }
.num b { display: block; font-size: var(--fs-body); font-weight: 500; }
.num span { font-size: var(--fs-small); color: var(--muted); }
.num--accent { background: var(--accent); color: #fff; }
.num--accent span { color: rgb(255 255 255/.72); }
@media (max-width: 860px) { .nums { grid-template-columns: minmax(0,1fr); }
  .nums__grid { grid-template-columns: minmax(0,1fr) minmax(0,1fr); } }
@media (max-width: 560px) { .nums__grid { grid-template-columns: minmax(0,1fr); } }
```

**Вариант «цифры на фото»** (Irstone): та же сетка 2×2 поверх тёмного фото цеха — `.nums__grid { background: none; }`, `.num { background: rgb(0 0 0/.0); }`, секции задать `background-image` с затемнением.

---

## 6. Направления — фото-карточки

Главный продающий блок подрядчика (Propoly). Номер позиции, теги поверх фото, заголовок, описание, кнопка.

```html
<section class="section" id="dirs">
  <div class="wrap">
    <p class="meta meta--dot">направления</p>
    <h2 class="h2">Работаем с объектами разных типов и назначения</h2>
    <div class="dirs">
      <article class="dir">
        <img src="warehouse.webp" alt="Складской комплекс" loading="lazy" width="1200" height="800">
        <p class="dir__no">01/06</p>
        <ul class="dir__tags"><li class="tag">Устойчивость к износу</li><li class="tag">Работа под нагрузкой</li><li class="tag">Стабильное покрытие</li></ul>
        <div class="dir__body">
          <h3 class="h3">Складские комплексы</h3>
          <p>Промышленные полы для складов с учётом постоянной нагрузки от техники, перемещения грузов и интенсивной эксплуатации.</p>
          <a class="btn btn--ghost btn--sm" href="#cta">Подобрать решение</a>
        </div>
      </article>
      <!-- ещё 5 -->
    </div>
  </div>
</section>
```
```css
.dirs { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-block-start: 2.5rem; }
.dir { position: relative; min-height: 420px; border-radius: var(--r-md); overflow: clip;
       display: grid; align-content: end; color: #fff; padding: 1.75rem; isolation: isolate; }
.dir > img { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; object-fit: cover; z-index: -2; }
.dir::before { content: ""; position: absolute; inset: 0; z-index: -1;
   background: linear-gradient(180deg, rgb(0 0 0/.45) 0%, rgb(0 0 0/.15) 35%, rgb(0 0 0/.8) 100%); }
.dir__no { position: absolute; inset-block-start: 1.5rem; inset-inline-start: 1.75rem;
           font-size: var(--fs-meta); letter-spacing: .08em; opacity: .8; margin: 0; }
.dir__tags { position: absolute; inset-block-start: 3.25rem; inset-inline-start: 1.75rem;
             display: grid; gap: .4rem; justify-items: start; }
.dir__body p { font-size: var(--fs-small); color: rgb(255 255 255/.75); margin: .6rem 0 1.25rem; max-width: 46ch; }
@media (max-width: 860px) { .dirs { grid-template-columns: minmax(0,1fr); } .dir { min-height: 340px; } }
```

---

## 7. Этапы процесса

Четыре колонки с иконкой в рамке (Irstone). Первую колонку можно дать на другом фоне.

```html
<section class="section section--surface" id="steps">
  <div class="wrap">
    <p class="meta meta--dot">циклы</p>
    <h2 class="h2">Контроль на всех этапах производства</h2>
    <ol class="steps">
      <li class="step"><span class="ico ico--box"><!-- svg --></span><h3>Сырьё</h3>
        <p>Контроль начинается с собственных карьеров: мы самостоятельно добываем и отбираем сырьё.</p></li>
      <li class="step"><span class="ico ico--box"><!-- svg --></span><h3>Обработка</h3>
        <p>Первичная обработка на современном оборудовании — параметры материала задаются на этом этапе.</p></li>
      <li class="step"><span class="ico ico--box"><!-- svg --></span><h3>Производство</h3>
        <p>В собственных цехах изготавливаем продукцию, полностью контролируя качество и сроки.</p></li>
      <li class="step"><span class="ico ico--box"><!-- svg --></span><h3>Готовое изделие</h3>
        <p>Финальный контроль гарантирует соответствие высоким стандартам и предсказуемый результат.</p></li>
    </ol>
  </div>
</section>
```
```css
.steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--line);
         margin-block-start: 2.5rem; list-style: none; padding: 0; }
.step { background: var(--ground); padding: 1.75rem; }
.step:first-child { background: var(--surface); }
.step h3 { font-size: var(--fs-h3); font-weight: 500; margin: 1rem 0 .6rem; }
.step p { font-size: var(--fs-small); color: var(--muted); margin: 0; }
.ico--box { display: grid; place-items: center; inline-size: 44px; block-size: 44px;
            border: 1px solid var(--line); border-radius: var(--r-sm); }
@media (max-width: 900px) { .steps { grid-template-columns: 1fr 1fr; } }
@media (max-width: 520px) { .steps { grid-template-columns: 1fr; } }
```

---

## 8. Разделы каталога

Шесть карточек в ряд (Дата-Поинт): фото товара на белом, название, счётчик позиций, значок `+`.

```html
<ul class="cats">
  <li class="cat"><img src="p1.webp" alt="" loading="lazy" width="400" height="300">
      <h3>Оптические патч-корды MPO/MTP</h3><span>10 товаров</span><em class="cat__plus">+</em></li>
</ul>
```
```css
.cats { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px,1fr)); gap: 1rem; padding: 0; }
.cat { position: relative; background: var(--surface); border: 1px solid var(--line);
       border-radius: var(--r-md); padding: 1.25rem; display: grid; align-content: start; gap: .5rem; }
.cat img { aspect-ratio: 4/3; object-fit: contain; }
.cat h3 { font-size: var(--fs-small); font-weight: 500; margin: 0; }
.cat span { font-size: var(--fs-meta); color: var(--muted); }
.cat__plus { position: absolute; inset-block-start: .75rem; inset-inline-end: .75rem;
             inline-size: 22px; block-size: 22px; display: grid; place-items: center;
             background: var(--accent); color: #fff; border-radius: 4px; font-style: normal; font-size: 14px; }
```

---

## 9. Карточка товара с ценой

```html
<article class="prod">
  <img src="cord.webp" alt="Оптический патч-корд MPO OM3" loading="lazy" width="600" height="450">
  <h3>Оптический патч-корд MPO OM3</h3>
  <p class="prod__spec">MPO female | MPO male | to UPC | 850/1300nm</p>
  <p class="prod__price">от <b>2 092 ₽</b></p>
</article>
```
```css
.prod { background: var(--ground); border: 1px solid var(--line); border-radius: var(--r-md); padding: 1.25rem; }
.prod img { aspect-ratio: 4/3; object-fit: contain; margin-block-end: 1rem; }
.prod h3 { font-size: var(--fs-small); font-weight: 500; margin: 0 0 .4rem; }
.prod__spec { font-size: var(--fs-meta); color: var(--muted); margin: 0 0 .75rem;
              overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.prod__price { font-size: var(--fs-body); margin: 0; color: var(--muted); }
.prod__price b { font-weight: 600; color: var(--ink); }
```

---

## 10. Спецификация изделия

Карточка Monaer: название, описание, два столбца «преимущество / комплектация», рендер с плашкой, маркетплейсы.

```html
<article class="spec">
  <div class="spec__text">
    <h3 class="h2">Тормозные <span class="h2__mute">диски</span></h3>
    <p>Разработаны для стабильной работы в любых условиях: от пробок до трасс. Высокая теплопроводность, усиленная конструкция и премиальная комплектация.</p>
    <div class="spec__cols">
      <div><p class="meta">преимущество</p>
        <ul class="bullets"><li>Повышенный коэффициент трения MS0.44 / PS0.388</li><li>Высокая теплопроводность — устойчивость к нагрузкам</li></ul></div>
      <div><p class="meta">комплектация</p>
        <ul class="bullets"><li>2 диска (правый и левый)</li><li>Щётка для очистки</li><li>Салфетка из микрофибры</li></ul></div>
    </div>
    <p class="meta">Покупайте на маркетплейсах:</p>
    <ul class="mkt"><li>Ozon</li><li>Wildberries</li><li>Яндекс.Маркет</li></ul>
  </div>
  <figure class="spec__img"><img src="disc.webp" alt="" loading="lazy" width="800" height="800">
    <figcaption>до 100 тыс км<span>срок службы</span></figcaption></figure>
</article>
```
```css
.spec { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr); gap: 2rem;
        background: var(--ground); border-radius: var(--r-lg); padding: 2rem; }
.spec__cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-block: 1.5rem; }
.bullets { display: grid; gap: .55rem; font-size: var(--fs-small); padding: 0; }
.bullets li { position: relative; padding-inline-start: 1.1em; }
.bullets li::before { content: ""; position: absolute; inset-inline-start: 0; inset-block-start: .5em;
  inline-size: 6px; block-size: 6px; border-radius: 50%; background: var(--accent); }
.spec__img { position: relative; margin: 0; border-radius: var(--r-md); overflow: clip; }
.spec__img figcaption { position: absolute; inset-block-end: 1rem; inset-inline-start: 1rem;
  background: rgb(255 255 255/.9); backdrop-filter: blur(8px); border-radius: var(--r-sm);
  padding: .6rem .9rem; font-size: var(--fs-body); font-weight: 500; }
.spec__img figcaption span { display: block; font-size: var(--fs-meta); color: var(--muted); font-weight: 400; }
.mkt { display: flex; flex-wrap: wrap; gap: .5rem; padding: 0; }
.mkt li { background: var(--ground-dark); color: #fff; border-radius: var(--r-sm);
          padding: .5rem .9rem; font-size: var(--fs-meta); }
@media (max-width: 860px) { .spec, .spec__cols { grid-template-columns: minmax(0,1fr); } }
```

---

## 11. Преимущества с нумерацией справа

Дата-Поинт: заголовок слева, справа колонка пунктов, номер `[01]` в правом углу, тонкие разделители.

```html
<div class="wrap adv">
  <div><p class="meta">[ 4 преимущества ]</p>
    <h2 class="h2">Современные решения для безопасной и стабильной работы вашей сети</h2></div>
  <ul class="adv__list">
    <li><h3>Мы являемся производителем патч-кордов MPO в РФ</h3>
        <p>Обладаем высокими компетенциями и опытом в данной области.</p><span class="adv__no">[01]</span></li>
  </ul>
</div>
```
```css
.adv { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.1fr); gap: 3rem; }
.adv__list { padding: 0; }
.adv__list li { position: relative; padding: 1.5rem 3.5rem 1.5rem 0; border-block-start: 1px solid var(--line); }
.adv__list li:last-child { border-block-end: 1px solid var(--line); }
.adv__list h3 { font-size: var(--fs-h3); font-weight: 500; margin: 0 0 .5rem; }
.adv__list p { font-size: var(--fs-small); color: var(--muted); margin: 0; max-width: 52ch; }
.adv__no { position: absolute; inset-block-start: 1.5rem; inset-inline-end: 0;
           font-size: var(--fs-meta); color: var(--muted); }
@media (max-width: 860px) { .adv { grid-template-columns: minmax(0,1fr); gap: 1.5rem; } }
```

---

## 12. Бенто с одной акцентной плиткой

EasyBuild и Woodpecker: 5–6 плиток, одна залита акцентом.

```css
.bento { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 1rem; }
.bento > * { background: var(--surface); border-radius: var(--r-md); padding: 1.5rem; }
.bento > b { display: block; font-size: var(--fs-h3); font-weight: 500; margin-block-end: .75rem; }
.bento > .is-accent { background: var(--accent); color: #fff; }
```

Акцентной делается плитка с **самым сильным аргументом**, а не первая по порядку.

---

## 13. Проблема → решение

Структура Главного Пути. Сначала тёмная секция с четырьмя рисками, затем светлая с решением.

```html
<section class="section section--dark">
  <div class="wrap">
    <p class="meta meta--dot">проблема</p>
    <h2 class="h2">Почему перевозка становится риском для бизнеса?</h2>
    <ul class="risks">
      <li><span class="ico"><!-- svg --></span><h3>Случайные перевозчики</h3>
          <p>Каждый рейс превращается в лотерею и несёт в себе скрытые риски.</p></li>
    </ul>
    <p class="meta">мы выстроили процесс, в котором этих проблем нет</p>
  </div>
</section>
```
```css
.risks { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-block: 2.5rem 1.5rem; padding: 0; }
.risks li { background: rgb(255 255 255/.04); border: 1px solid rgb(255 255 255/.1);
            border-radius: var(--r-md); padding: 1.5rem; }
.risks h3 { font-size: var(--fs-body); font-weight: 500; margin: 2.5rem 0 .5rem; }
.risks p { font-size: var(--fs-meta); text-transform: uppercase; letter-spacing: .04em;
           line-height: 1.6; color: rgb(255 255 255/.55); margin: 0; }
@media (max-width: 900px) { .risks { grid-template-columns: 1fr 1fr; } }
```

---

## 14. Подбор

Два рабочих формата.

**А. «Поможем подобрать»** (Monaer) — заголовок-вопрос, одна кнопка, справа сетка логотипов совместимых брендов.
**Б. Квиз** (Siding, EasyBuild) — 3–5 шагов с выбором картинкой, в конце форма.

```html
<section class="section section--dark">
  <div class="wrap pick">
    <div><h2 class="h2">Не уверены, подойдёт ли деталь?</h2>
      <p>Мы лично проверим совместимость с вашим авто и подберём точный артикул.</p>
      <a class="btn btn--primary" href="#cta">Помощь в подборе</a></div>
    <ul class="pick__logos"><li>JETOUR</li><li>LADA</li><li>CHERY</li><li>HAVAL</li><li>GEELY</li><li>VW</li></ul>
  </div>
</section>
```
```css
.pick { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,.9fr); gap: 3rem; align-items: center; }
.pick__logos { display: grid; grid-template-columns: repeat(3,1fr); gap: .5rem; padding: 0; }
.pick__logos li { display: grid; place-items: center; aspect-ratio: 16/9;
  background: rgb(255 255 255/.06); border: 1px solid rgb(255 255 255/.1);
  border-radius: var(--r-md); font-size: var(--fs-meta); letter-spacing: .08em; }
@media (max-width: 860px) { .pick { grid-template-columns: minmax(0,1fr); } }
```

Квиз обязан: показывать прогресс (`Шаг 2 из 4`), давать вернуться назад, не спрашивать телефон раньше последнего шага и работать без JS хотя бы как обычная форма.

---

## 15. География

Карта с точками и подписями (Monaer) либо простой список городов и складов. Карта — статичный SVG или webp, не тяжёлый виджет. Подписи — `.meta` с соединительной линией.

---

## 16. Объекты и портфолио

**А. Крупный кадр + лента миниатюр** (Brick Art): фото объекта 2/3 ширины, справа вертикальная колонка из 4–5 миниатюр, в углу метки «5 недель · 210 м²».
**Б. Разноразмерная сетка** (Blackwood): 4–6 фото разных пропорций, подпись-название под каждым, без описаний.

Под каждым объектом — минимум два факта: срок и объём. Это то, ради чего блок существует.

---

## 17. Клиенты

Логотипы крупно и монохромно, 6–10 штук, в одну-две строки. Не карусель.

```css
.clients { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: 2.5rem;
           align-items: center; justify-items: center; }
.clients img { max-height: 34px; width: auto; filter: grayscale(1); opacity: .65; transition: .2s; }
.clients img:hover { filter: none; opacity: 1; }
```

---

## 18. FAQ

Аккордеон на `<details>` — без JS, доступен с клавиатуры, индексируется.

```html
<details class="faq"><summary>Сколько занимает расчёт стоимости?</summary>
  <p>До 24 часов после получения ТЗ или замеров с объекта.</p></details>
```
```css
.faq { border-block-end: 1px solid var(--line); }
.faq summary { display: flex; justify-content: space-between; gap: 2rem; align-items: center;
  padding-block: 1.25rem; font-size: var(--fs-h3); font-weight: 500; cursor: pointer; list-style: none; }
.faq summary::-webkit-details-marker { display: none; }
.faq summary::after { content: "+"; font-size: 1.5em; line-height: 1; color: var(--accent); }
.faq[open] summary::after { content: "−"; }
.faq p { margin: 0 0 1.25rem; font-size: var(--fs-body); color: var(--muted); max-width: 70ch; }
```

---

## 19. CTA и форма

Одна секция, одно действие. Форма короткая: имя, телефон, задача. Согласие с политикой — обязательно.

```html
<section class="section section--dark" id="cta">
  <div class="wrap cta">
    <div><p class="meta meta--dot">заявка</p>
      <h2 class="h2">Рассчитаем стоимость за 24 часа</h2>
      <p>Пришлите ТЗ или опишите объект — инженер посчитает и позвонит.</p></div>
    <form class="form" method="post" action="/lead">
      <label>Как к вам обращаться<input name="name" autocomplete="name" required></label>
      <label>Телефон<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required></label>
      <label>Задача<textarea name="task" rows="3"></textarea></label>
      <label class="form__agree"><input type="checkbox" name="agree" required>
        Согласен с <a href="/privacy">политикой обработки персональных данных</a></label>
      <button class="btn btn--primary" type="submit">Отправить заявку</button>
    </form>
  </div>
</section>
```
```css
.cta { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 3rem; align-items: start; }
.form { display: grid; gap: 1rem; }
.form label { display: grid; gap: .4rem; font-size: var(--fs-meta);
              text-transform: uppercase; letter-spacing: .08em; color: rgb(255 255 255/.6); }
.form :is(input,textarea) { font: inherit; font-size: var(--fs-body); text-transform: none; letter-spacing: 0;
  color: #fff; background: rgb(255 255 255/.06); border: 1px solid rgb(255 255 255/.16);
  border-radius: var(--r-sm); padding: .85rem 1rem; }
.form :is(input,textarea):focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.form__agree { display: flex; align-items: start; gap: .6rem; text-transform: none; letter-spacing: 0; }
@media (max-width: 860px) { .cta { grid-template-columns: minmax(0,1fr); } }
```

---

## 20. Подвал

Реквизиты полностью: юрлицо, ИНН, адрес производства, телефон, почта, мессенджеры, ссылка на политику. Для производственной компании реквизиты — тоже доказательство: их отсутствие читается как «фирма-однодневка».

---

## 21. Липкая мобильная панель

Обязательна. Телефон и заявка всегда под большим пальцем.

```css
.dock { position: fixed; inset-block-end: 0; inset-inline: 0; z-index: 60; display: none;
        grid-template-columns: 1fr 1fr; gap: .5rem; padding: .6rem;
        background: var(--ground); border-block-start: 1px solid var(--line);
        padding-block-end: max(.6rem, env(safe-area-inset-bottom)); }
@media (max-width: 760px) { .dock { display: grid; } body { padding-block-end: 4.5rem; } }
```
