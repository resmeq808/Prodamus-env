// Съёмка и механическая проверка страницы для арт-ревью.
//
//   node capture.js <путь к html или URL> [папка=./review]
//
// Нужен Playwright (NODE_PATH на глобальные модули или локальная установка).
// Путь к Chromium — CHROMIUM_PATH, иначе браузер Playwright.
//
// Результат в папке:
//   shots/fold-1440.png          первый экран, как его видит посетитель
//   shots/1440-NN.png            вся страница кусками по 1400px (читаемо при просмотре)
//   shots/768-NN.png, 390-NN.png планшет и телефон кусками
//   shots/sections-1440/NN.png   каждая секция отдельно
//   shots/nav-<ширина>/NN.png     шапка в прокрученном состоянии над каждой секцией
//   checks.json                  все механические находки по ширинам
//   checks.md                    то же, коротко, для чтения
//
// Механика ловит то, что глаз пропускает: перекрытия текста, висячие слова,
// битые якоря, заглушки href="#", кнопки в две строки, плотный трекинг,
// мелкий кегль, длинные строки, растянутые картинки, горизонтальный скролл,
// маленькие тап-зоны, разнобой кеглей и радиусов. Вкус она не оценивает.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const target = process.argv[2];
if (!target) { console.error('usage: node capture.js <file|url> [outdir]'); process.exit(1); }
const OUT = path.resolve(process.argv[3] || 'review');
const url = /^https?:/.test(target) ? target : 'file://' + path.resolve(target);
fs.mkdirSync(path.join(OUT, 'shots', 'sections-1440'), { recursive: true });

function audit() {
  const iw = innerWidth, out = [];
  const add = (sev, kind, el, msg) => {
    const r = el ? el.getBoundingClientRect() : null;
    out.push({ sev, kind, msg, sel: el ? sel(el) : '', text: el ? (el.innerText || el.alt || '').trim().replace(/\s+/g, ' ').slice(0, 70) : '',
      box: r ? [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)] : null });
  };
  const sel = el => { const p = []; let e = el; for (let i = 0; e && e !== document.body && i < 4; i++) { let s = e.tagName.toLowerCase(); if (e.id) { s += '#' + e.id; p.unshift(s); break; } if (e.classList.length) s += '.' + [...e.classList].slice(0, 2).join('.'); p.unshift(s); e = e.parentElement; } return p.join(' > '); };
  const vis = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > .05; };
  const rgb = s => { const m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const directText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
  const textEls = [...document.querySelectorAll('body *')].filter(el => directText(el) && vis(el));

  // 1. горизонтальный скролл
  if (document.documentElement.scrollWidth > iw + 1) {
    const wide = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); if (r.right <= iw + 1) return false; for (let a = e.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o !== 'visible') return false; } return true; }).slice(0, 3);
    add('блокер', 'горизонтальный скролл', wide[0], `ширина документа ${document.documentElement.scrollWidth}px при окне ${iw}px`);
  }

  // 2. текст перекрыт другим элементом
  for (const el of textEls) {
    const trg = document.createRange(); trg.selectNodeContents(el);
    const r = trg.getBoundingClientRect(); if (r.width < 4 || r.top < 0 || r.bottom > innerHeight) continue;   // границы самого текста, только в окне
    const pts = [[r.left + r.width * .5, r.top + r.height * .5], [r.left + r.width * .2, r.top + r.height * .5], [r.left + r.width * .8, r.top + r.height * .5]];
    let hits = 0, by = null;
    for (const [x, vy] of pts) {
      if (vy < 0 || vy > innerHeight || x < 0 || x > iw) continue;
      const top = document.elementFromPoint(x, vy);
      if (top && top !== el && !el.contains(top) && !top.contains(el) && !top.closest('header, [data-nav], nav')) {
        const cs = getComputedStyle(top);
        const opaque = top.tagName === 'IMG' || top.tagName === 'VIDEO' || top.tagName === 'CANVAS' || rgb(cs.backgroundColor)?.a > .3 || cs.backgroundImage !== 'none';
        if (cs.pointerEvents !== 'none' && opaque) { hits++; by = top; } }
    }
    if (hits >= 2) add('важно', 'текст перекрыт', el, `закрыт элементом ${sel(by)}`);
  }

  // 3. кеглевые проблемы, трекинг, длина строки, висячие строки
  const sizes = new Set();
  for (const el of textEls) {
    const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize); sizes.add(Math.round(fs));
    const ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing) / fs;
    const upper = cs.textTransform === 'uppercase';
    if (fs >= 36 && ls < (fs >= 200 ? -0.06 : -0.035)) add('важно', 'плотный трекинг', el, `${Math.round(fs)}px, letter-spacing ${ls.toFixed(3)}em — буквы слипаются, норма −0.02…−0.03em`);
    if (!upper && fs < 12 && el.innerText.trim().length > 12) add('важно', 'мелкий кегль', el, `${fs}px — меньше 12px читается с трудом`);
    if (upper && fs < 10) add('важно', 'мелкий капс', el, `${fs}px капсом`);
    if (el.tagName === 'P' || el.tagName === 'LI') {
      const r = el.getBoundingClientRect(), chars = r.width / (fs * .5);
      if (fs <= 20 && chars > 85 && el.innerText.length > 120) add('полировка', 'длинная строка', el, `≈${Math.round(chars)} знаков в строке, норма 45–75`);
    }
    // висячая строка: последняя строка заголовка/лида короче 18% ширины
    if (/^H[1-4]$/.test(el.tagName) || fs >= 22) {
      const rects = [];
      for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { const rg = document.createRange(); rg.selectNodeContents(n); rects.push(...[...rg.getClientRects()].filter(x => x.width > 2 && x.height >= fs * .6)); }
      const lines = []; for (const x of rects) { const l = lines.find(L => Math.abs(L.top - x.top) < fs * .4); if (l) { l.l = Math.min(l.l, x.left); l.r = Math.max(l.r, x.right); } else lines.push({ top: x.top, l: x.left, r: x.right }); }
      if (lines.length > 1) { lines.sort((a, b) => a.top - b.top); const last = lines[lines.length - 1], w = el.getBoundingClientRect().width, lw = last.r - last.l;
        const lastText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ').trim().split(/\s+/).pop();
        if (lw < w * .18 && lastText.length < 12) add('полировка', 'висячее слово', el, `последняя строка «${lastText}» — ${Math.round(lw)}px из ${Math.round(w)}px`); }
    }
    // контраст на однотонном фоне
    let bg = null; const er = el.getBoundingClientRect();
    // фиксированная шапка: фон — то, что лежит под ней, а не фон body;
    // полупрозрачная подложка самой шапки (a > .6) считается её фоном
    let fixedRoot = null;
    for (let a = el; a; a = a.parentElement) { const pos = getComputedStyle(a).position; if (pos === 'fixed' || pos === 'sticky') { fixedRoot = a; break; } }
    let start = el;
    if (fixedRoot) {
      const hasOwnBg = (() => { for (let a = el; a && a !== fixedRoot.parentElement; a = a.parentElement) { const c = rgb(getComputedStyle(a).backgroundColor); if ((c && c.a > .6) || getComputedStyle(a).backgroundImage !== 'none') return true; } return false; })();
      if (!hasOwnBg) {
        const under = document.elementsFromPoint(er.left + er.width / 2, er.top + er.height / 2).find(n => !fixedRoot.contains(n));
        if (under && /^(IMG|VIDEO|CANVAS)$/.test(under.tagName)) bg = 'image';
        else if (under) start = under;
      }
    }
    for (let a = start; a && !bg; a = a.parentElement) {
      if (getComputedStyle(a).backgroundImage !== 'none') { bg = 'image'; break; }
      const media = [...a.children].find(ch => /^(IMG|VIDEO|PICTURE|CANVAS)$/.test(ch.tagName) && ch !== el && !ch.contains(el) && (() => { const r = ch.getBoundingClientRect(); return r.left <= er.left + 2 && r.right >= er.right - 2 && r.top <= er.top + 2 && r.bottom >= er.bottom - 2; })());
      if (media) { bg = 'image'; break; }
      const c = rgb(getComputedStyle(a).backgroundColor); if (c && c.a > (fixedRoot && fixedRoot.contains(a) ? .6 : .9)) { bg = c; break; } }
    const fg = rgb(cs.color);
    if (bg && bg !== 'image' && fg) { const k = ratio({ ...fg }, bg) * (fg.a < 1 ? fg.a : 1) + (fg.a < 1 ? 0 : 0); const need = fs >= 24 || (fs >= 18.5 && +cs.fontWeight >= 600) ? 3 : 4.5;
      const mix = { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a) }; const kk = ratio(mix, bg);
      if (kk < need) add(kk < need * .75 ? 'важно' : 'полировка', 'контраст', el, `${kk.toFixed(2)}:1 при норме ${need}:1`); }
  }
  if (sizes.size > 14) add('полировка', 'разнобой кеглей', null, `${sizes.size} разных размеров текста: ${[...sizes].sort((a, b) => a - b).join(', ')}`);

  // 4. ссылки и кнопки
  const links = [...document.querySelectorAll('a[href]')].filter(vis);
  const dead = links.filter(a => a.getAttribute('href') === '#');
  if (dead.length) add('важно', 'ссылки-заглушки', dead[0], `${dead.length} ссылок ведут на «#»: ${[...new Set(dead.map(a => a.innerText.trim().slice(0, 24)))].slice(0, 8).join(' · ')}`);
  for (const a of links) { const h = a.getAttribute('href'); if (/^#.+/.test(h) && !document.getElementById(decodeURIComponent(h.slice(1)))) add('блокер', 'битый якорь', a, `${h} — такого id на странице нет`); }
  const menuTargets = {}; for (const a of document.querySelectorAll('header a[href^="#"], [data-nav] a[href^="#"]')) { const h = a.getAttribute('href'); if (h === '#') continue; (menuTargets[h] = menuTargets[h] || []).push(a.innerText.trim()); }
  for (const [h, names] of Object.entries(menuTargets)) if (new Set(names).size > 1) add('важно', 'пункты меню в одно место', null, `${names.join(' / ')} → ${h}`);
  const btns = [...document.querySelectorAll('a, button')].filter(vis).filter(b => { const cs = getComputedStyle(b); return (rgb(cs.backgroundColor)?.a > .5 || parseFloat(cs.borderTopWidth) > 0) && b.innerText.trim(); });
  for (const b of btns) { const cs = getComputedStyle(b), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2; if (b.getBoundingClientRect().height > lh * 2.2 && b.getBoundingClientRect().height < 120 && b.innerText.trim().length < 40) { const tops = new Set(); const tw = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); let tn; while ((tn = tw.nextNode())) { if (!tn.textContent.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(tn); for (const r of rg.getClientRects()) if (r.width > 2) tops.add(Math.round(r.top / 4)); } if (tops.size > 1) add('важно', 'кнопка в две строки', b, ''); } }
  if (iw < 500) for (const b of links.concat([...document.querySelectorAll('button')])) { const r = b.getBoundingClientRect(); if (vis(b) && r.width < 40 && r.height < 40 && r.width > 0) add('полировка', 'маленькая тап-зона', b, `${Math.round(r.width)}×${Math.round(r.height)}px, нужно ≥44`); }
  const painted = [...document.querySelectorAll('a, button, a *, button *')].filter(vis).filter(b => { const cs = getComputedStyle(b), h = b.getBoundingClientRect().height; return (rgb(cs.backgroundColor)?.a > .5 || parseFloat(cs.borderTopWidth) > 0) && h >= 28 && h <= 80 && b.innerText.trim(); });
  const ctaTexts = [...new Set(painted.map(b => b.closest('a, button')))].filter(b => !b.closest('header, [data-nav]') || true).map(b => b.innerText.trim().toLowerCase()).filter(t => t.length > 3);

  // 5. картинки
  for (const img of [...document.images].filter(vis)) {
    const r = img.getBoundingClientRect();
    if (!img.complete || img.naturalWidth === 0) { add('блокер', 'картинка не загрузилась', img, img.getAttribute('src')?.slice(0, 60)); continue; }
    const dpr = 1.5; if (img.naturalWidth < r.width * dpr * .8 && r.width > 300) add('полировка', 'мыльная картинка', img, `натуральная ширина ${img.naturalWidth}px при показе ${Math.round(r.width)}px — на ретине размыто`);
    if (!img.hasAttribute('width') || !img.hasAttribute('height')) add('полировка', 'картинка без размеров', img, 'страница будет прыгать при загрузке');
  }
  for (const el of document.querySelectorAll('*')) { const bi = getComputedStyle(el).backgroundImage; if (bi.includes('url(') && vis(el) && el.getBoundingClientRect().width > 50) { /* фоновые картинки проверяются глазами */ } }

  // 6. структура
  const h1 = document.querySelectorAll('h1'); if (h1.length !== 1) add('важно', 'h1', null, `на странице ${h1.length} заголовков h1`);
  let prev = 1; for (const h of document.querySelectorAll('h1,h2,h3,h4')) { const n = +h.tagName[1]; if (n > prev + 1) add('полировка', 'пропуск уровня заголовка', h, `h${prev} → h${n}`); prev = n; }
  const radii = new Set([...document.querySelectorAll('body *')].filter(vis).map(e => parseFloat(getComputedStyle(e).borderTopLeftRadius)).filter(v => v > 0 && v < 400).map(v => v >= 99 ? 'pill' : Math.round(v)));
  if (radii.size > 6) add('полировка', 'разнобой радиусов', null, `${radii.size} значений: ${[...radii].join(', ')}`);
  const fams = new Set(textEls.map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim()));
  const famsNoMono = [...fams].filter(f => !/mono|code/i.test(f));
  if (famsNoMono.length > 3) add('важно', 'много гарнитур', null, [...fams].join(', '));
  else if (fams.size > 3) add('полировка', 'много гарнитур', null, [...fams].join(', ') + ' — проверить, нужен ли моноширинный');
  if (!document.querySelector('meta[name=description]')) add('полировка', 'нет description', null, '');
  if (!document.querySelector('meta[property="og:image"]')) add('полировка', 'нет og:image', null, 'превью ссылки в мессенджерах будет пустым');
  const css = [...document.styleSheets].map(s => { try { return [...s.cssRules].map(r => r.cssText).join('\n'); } catch (e) { return ''; } }).join('\n');
  if (!/prefers-reduced-motion/.test(css)) add('важно', 'нет prefers-reduced-motion', null, '');
  if (!/focus-visible/.test(css)) add('важно', 'нет :focus-visible', null, '');

  // секции для отдельной съёмки
  const sections = [...document.querySelectorAll('header, section, footer, main > *')].filter(vis).map(s => { const r = s.getBoundingClientRect(); return { y: Math.round(r.top + scrollY), h: Math.round(r.height), sel: sel(s) }; }).filter(s => s.h > 120);
  return { findings: out, sections, ctaTexts, docH: document.documentElement.scrollHeight, fonts: [...fams], sizes: [...sizes].sort((a, b) => a - b), title: document.title };
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const report = {};
  for (const w of [1440, 768, 390]) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' }).catch(() => {});   // иначе снимки ловят середину плавной прокрутки
    await p.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager'));
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 700) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(60); }
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForLoadState('networkidle').catch(() => {}); await p.waitForTimeout(2200);
    if (w === 1440) await p.screenshot({ path: path.join(OUT, 'shots', 'fold-1440.png') });
    // аудит после прокрутки: elementFromPoint работает в видимой области, поэтому прогоняем по экранам
    const all = { findings: [] };
    for (let y = 0; y < H; y += 800) {
      await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(40);
      const r = await p.evaluate(audit);
      for (const f of r.findings) if (!all.findings.some(g => g.kind === f.kind && g.text === f.text && g.msg.replace(/[\d.]+px/g, '') === f.msg.replace(/[\d.]+px/g, ''))) all.findings.push(f);
      Object.assign(all, { sections: r.sections, ctaTexts: r.ctaTexts, docH: r.docH, fonts: r.fonts, sizes: r.sizes, title: r.title });
    }
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
    const full = path.join(OUT, 'shots', `${w}-full.png`);
    await p.screenshot({ path: full, fullPage: true });
    // куски по 1400px для просмотра
    const chunk = w === 1440 ? 1400 : 1800;
    for (let i = 0, y = 0; y < all.docH; i++, y += chunk) {
      await p.screenshot({ path: path.join(OUT, 'shots', `${w}-${String(i).padStart(2, '0')}.png`), clip: { x: 0, y, width: w, height: Math.min(chunk, all.docH - y) }, fullPage: true });
    }
    // шапка в прокрученном состоянии над каждой секцией: липкие шапки ломаются именно так
    fs.mkdirSync(path.join(OUT, 'shots', `nav-${w}`), { recursive: true });
    { let k = 0; for (const s of all.sections.filter((s, i, arr) => i === 0 || s.y - arr[i - 1].y > 300).slice(0, 12)) {
        await p.evaluate(v => scrollTo(0, v), Math.max(0, s.y + 40)); await p.waitForTimeout(350);
        await p.screenshot({ path: path.join(OUT, 'shots', `nav-${w}`, `${String(k++).padStart(2, '0')}.png`), clip: { x: 0, y: 0, width: w, height: 150 } });
      } await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300); }
    if (w === 1440) {
      let n = 0;
      for (const s of all.sections) { if (s.h > 3000) continue; await p.screenshot({ path: path.join(OUT, 'shots', 'sections-1440', `${String(n++).padStart(2, '0')}.png`), clip: { x: 0, y: s.y, width: w, height: Math.min(s.h, 2400) }, fullPage: true }).catch(() => {}); }
    }
    fs.unlinkSync(full);
    report[w] = all;
    await p.close();
  }
  await browser.close();

  // одна формулировка на одно действие
  const cta = {}; for (const t of report[1440].ctaTexts) cta[t] = (cta[t] || 0) + 1;
  fs.writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify(report, null, 1));
  const order = { 'блокер': 0, 'важно': 1, 'полировка': 2 };
  let md = `# Механическая проверка: ${report[1440].title}\n\nГарнитуры: ${report[1440].fonts.join(', ')} · кегли: ${report[1440].sizes.join(', ')}\n\nПодписи кнопок: ${Object.entries(cta).map(([k, v]) => `«${k}»×${v}`).join(', ')}\n`;
  for (const w of [1440, 768, 390]) {
    // одинаковые находки у однотипных элементов схлопываются в одну строку с «×N»
    const groups = [];
    for (const x of report[w].findings) {
      const key = x.sev + x.kind + x.msg + (x.sel || '').split(' > ').pop();
      const g = groups.find(g => g.key === key);
      if (g) { g.n++; if (g.texts.length < 3 && x.text) g.texts.push(x.text); } else groups.push({ key, n: 1, texts: x.text ? [x.text] : [], ...x });
    }
    groups.sort((a, b) => order[a.sev] - order[b.sev]);
    md += `\n## ${w}px — ${groups.length} находок\n\n`;
    for (const x of groups) md += `- **${x.sev}** · ${x.kind}${x.n > 1 ? ` ×${x.n}` : ''}${x.texts.length ? ` · «${x.texts.join('», «')}»` : ''}${x.msg ? ` — ${x.msg}` : ''}${x.box ? ` · y=${x.box[1]}` : ''}${x.sel ? ` · \`${x.sel}\`` : ''}\n`;
  }
  fs.writeFileSync(path.join(OUT, 'checks.md'), md);
  console.log(md.split('\n').slice(0, 60).join('\n'));
  console.log(`\nскриншоты: ${path.join(OUT, 'shots')}`);
})();
