// Замер референсов: вычисленная типографика, сетка, цвет, кнопки + скриншоты.
// Тем же скриптом собрана выборка references/dataset.csv.
//
//   node measure.js sites.txt [потоков=4] [папка=./measure-out]
//   sites.txt — по одному домену на строку, без https://
//
// Нужен Playwright. Путь к Chromium задаётся CHROMIUM_PATH, иначе берётся браузер Playwright.
// Результат: <папка>/data/<домен>.json и <папка>/shots/<домен>.hero.jpg / .full.jpg
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.argv[4] || 'measure-out');
const OUT = path.join(ROOT, 'data');
const SHOTS = path.join(ROOT, 'shots');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(SHOTS, { recursive: true });

const sites = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
const CONC = +process.argv[3] || 4;

function extract() {
  const vw = innerWidth, vh = innerHeight;
  const rgb = s => { const m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const hex = c => c ? '#' + [c.r, c.g, c.b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('') : null;
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  const fam = f => (f || '').split(',')[0].replace(/["']/g, '').trim();
  const docH = document.documentElement.scrollHeight;

  // effective background of body
  const bgOf = el => { while (el) { const c = rgb(getComputedStyle(el).backgroundColor); if (c && c.a > 0.5) return c; el = el.parentElement; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const bodyBg = bgOf(document.body.firstElementChild || document.body);

  // text runs
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const fonts = {}, sizes = {}, colors = {};
  let totalChars = 0, upperShort = 0, n;
  const textEls = new Set();
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim(); if (t.length < 2) continue;
    const el = n.parentElement; if (!el || !vis(el)) continue;
    textEls.add(el);
    const cs = getComputedStyle(el);
    const f = fam(cs.fontFamily); fonts[f] = (fonts[f] || 0) + t.length;
    const sz = Math.round(parseFloat(cs.fontSize)); sizes[sz] = (sizes[sz] || 0) + t.length;
    const c = hex(rgb(cs.color)); colors[c] = (colors[c] || 0) + t.length;
    totalChars += t.length;
    if ((cs.textTransform === 'uppercase' || (t === t.toUpperCase() && /[A-ZА-Я]{3}/.test(t))) && t.length < 40 && parseFloat(cs.fontSize) < 15) upperShort++;
  }

  const styleOf = el => { if (!el) return null; const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { text: el.innerText.trim().replace(/\s+/g, ' ').slice(0, 160), font: fam(cs.fontFamily), size: parseFloat(cs.fontSize), weight: cs.fontWeight, lh: cs.lineHeight === 'normal' ? null : +(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2), ls: cs.letterSpacing === 'normal' ? 0 : +(parseFloat(cs.letterSpacing) / parseFloat(cs.fontSize)).toFixed(3), tt: cs.textTransform, color: hex(rgb(cs.color)), align: cs.textAlign, x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height), style: cs.fontStyle }; };

  // hero headline: biggest text in first 1.2 viewports
  let hero = null, heroSize = 0;
  for (const el of textEls) { const r = el.getBoundingClientRect(); if (r.top + scrollY > vh * 1.2) continue; const s = parseFloat(getComputedStyle(el).fontSize); if (s > heroSize && el.innerText.trim().length > 2) { heroSize = s; hero = el; } }
  // climb to block ancestor holding the whole headline
  if (hero) { let e = hero; while (e.parentElement && (getComputedStyle(e).display.startsWith('inline') || e.getBoundingClientRect().width < 120 || e.innerText.trim().length < 12) && e.parentElement !== document.body) { const p = e.parentElement; if (p.innerText.length > 300) break; e = p; } hero = e; }
  const h1 = document.querySelector('h1');

  // headings below hero
  const heads = [...document.querySelectorAll('h2, h3')].filter(vis).map(e => styleOf(e)).filter(h => h.text.length > 1).slice(0, 40);

  // paragraphs
  const ps = [...document.querySelectorAll('p')].filter(vis).filter(p => p.innerText.trim().length > 60).map(p => { const s = styleOf(p); return { size: s.size, lh: s.lh, w: s.w, font: s.font, color: s.color, chars: p.innerText.trim().length }; }).slice(0, 60);

  // buttons / CTAs
  const btns = [...document.querySelectorAll('a, button')].filter(vis).map(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); const bg = rgb(cs.backgroundColor);
    return { text: e.innerText.trim().replace(/\s+/g, ' ').slice(0, 60), bg: bg && bg.a > 0.5 ? hex(bg) : null, border: parseFloat(cs.borderTopWidth) > 0 ? hex(rgb(cs.borderTopColor)) : null, radius: cs.borderTopLeftRadius, h: Math.round(r.height), w: Math.round(r.width), y: Math.round(r.top + scrollY), size: parseFloat(cs.fontSize), weight: cs.fontWeight, color: hex(rgb(cs.color)) }; })
    .filter(b => b.text && b.text.length < 40 && (b.bg || b.border) && b.h >= 28 && b.h <= 80 && b.w < 400);

  // sections: large blocks that span the viewport width
  const blocks = [...document.querySelectorAll('section, header, footer, main > div, body > div > div, [class*=section], [class*=Section]')].filter(vis);
  const sections = [];
  for (const el of blocks) { const r = el.getBoundingClientRect(); if (r.height < 200 || r.width < vw * 0.9) continue; const cs = getComputedStyle(el); const bg = rgb(cs.backgroundColor);
    sections.push({ tag: el.tagName, y: Math.round(r.top + scrollY), h: Math.round(r.height), bg: bg && bg.a > 0.5 ? hex(bg) : null, bgImg: cs.backgroundImage !== 'none', pt: parseFloat(cs.paddingTop), pb: parseFloat(cs.paddingBottom) }); }

  // content width: widest left/right bounds of text blocks and images
  const lefts = [], rights = [], widths = [];
  for (const el of textEls) { const r = el.getBoundingClientRect(); if (r.width < 40) continue; lefts.push(Math.round(r.left)); rights.push(Math.round(vw - r.right)); }
  const media = [...document.querySelectorAll('img, video, picture, canvas, svg')].filter(vis).map(e => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top + scrollY), x: Math.round(r.left), tag: e.tagName }; }).filter(m => m.w > 200 && m.h > 150);
  const fullBleedMedia = media.filter(m => m.w >= vw * 0.97).length;
  const q = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.floor((s.length - 1) * p)]; };

  // radius sample from cards/images
  const radii = {};
  for (const el of [...document.querySelectorAll('div, img, a, button, section, article, li, figure')].slice(0, 4000)) { const cs = getComputedStyle(el); const r = parseFloat(cs.borderTopLeftRadius); if (!r) continue; const b = el.getBoundingClientRect(); if (b.width < 24 || b.height < 24) continue; const k = Math.min(Math.round(r), 999); radii[k] = (radii[k] || 0) + 1; }

  // area-weighted background colours
  const bgArea = {};
  for (const el of [...document.querySelectorAll('body, body *')].slice(0, 6000)) { const cs = getComputedStyle(el); const c = rgb(cs.backgroundColor); if (!c || c.a < 0.5) continue; const r = el.getBoundingClientRect(); const a = r.width * r.height; if (a < 5000) continue; const k = hex(c); bgArea[k] = (bgArea[k] || 0) + a; }

  const nav = document.querySelector('header, nav'); let navInfo = null;
  if (nav) { const r = nav.getBoundingClientRect(); const cs = getComputedStyle(nav); navInfo = { h: Math.round(r.height), pos: cs.position, links: nav.querySelectorAll('a').length, bg: hex(rgb(cs.backgroundColor)), blur: cs.backdropFilter !== 'none' && cs.backdropFilter !== '' }; }

  const topN = (o, k = 8) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, k);
  const hasVideo = !!document.querySelector('video');
  const fontFaces = [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/["']/g, '')))];

  return {
    title: document.title, desc: (document.querySelector('meta[name=description]') || {}).content || '', lang: document.documentElement.lang,
    docH, vw, bodyBg: hex(bodyBg), dark: lum(bodyBg) < 0.2,
    hero: styleOf(hero), h1: styleOf(h1), heads, ps,
    fonts: topN(fonts, 6).map(([f, c]) => [f, +(c / totalChars).toFixed(3)]), fontFaces,
    sizes: topN(sizes, 10), colors: topN(colors, 8), bgArea: topN(bgArea, 8).map(([k, a]) => [k, +(a / (vw * docH)).toFixed(3)]),
    btns: btns.slice(0, 40), sections: sections.slice(0, 60), nav: navInfo,
    contentLeft: { p10: q(lefts, .1), p50: q(lefts, .5) }, contentRight: { p10: q(rights, .1), p50: q(rights, .5) },
    media: media.length, fullBleedMedia, mediaSample: media.slice(0, 30), hasVideo,
    radii: topN(radii, 8), upperShort, totalChars,
  };
}

async function scan(browser, domain) {
  const file = path.join(OUT, domain + '.json');
  if (fs.existsSync(file)) return 'skip';
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', locale: 'en-US' });
  const page = await ctx.newPage();
  try {
    const resp = await page.goto('https://' + domain, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);
    // dismiss cookie banners
    for (const t of ['Accept all', 'Accept All', 'Accept', 'I agree', 'Allow all', 'OK', 'Got it', 'Принять', 'Согласен', 'Хорошо']) {
      const b = page.getByRole('button', { name: t, exact: true }).first();
      if (await b.isVisible().catch(() => false)) { await b.click({ timeout: 1500 }).catch(() => {}); break; }
    }
    // scroll through to trigger lazy content
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(H, 16000); y += 1000) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(90); }
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SHOTS, domain + '.hero.jpg'), type: 'jpeg', quality: 70 });
    const data = await page.evaluate(extract);
    if (/just a moment|security verification|access denied|attention required|verify you are human|403 forbidden/i.test(data.title + ' ' + (data.hero && data.hero.text))) data.blocked = true;
    data.domain = domain; data.status = resp ? resp.status() : null; data.finalUrl = page.url();
    // full-page, height-capped
    const fh = Math.min(data.docH, 10000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: path.join(SHOTS, domain + '.full.jpg'), type: 'jpeg', quality: 40, fullPage: fh === data.docH, clip: fh === data.docH ? undefined : { x: 0, y: 0, width: 1440, height: fh } }).catch(async () => {
      await page.screenshot({ path: path.join(SHOTS, domain + '.full.jpg'), type: 'jpeg', quality: 40, fullPage: true }).catch(() => {});
    });
    fs.writeFileSync(file, JSON.stringify(data));
    return 'ok';
  } catch (e) {
    fs.writeFileSync(file, JSON.stringify({ domain, error: e.message.split('\n')[0] }));
    return 'err';
  } finally { await ctx.close(); }
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--disable-blink-features=AutomationControlled', '--disable-dev-shm-usage'] });
  let i = 0, done = 0;
  const worker = async () => { while (i < sites.length) { const d = sites[i++]; const t = Date.now(); const r = await Promise.race([scan(browser, d), new Promise(res => setTimeout(() => res('timeout'), 120000))]); done++; console.log(`${done}/${sites.length} ${d} ${r} ${((Date.now() - t) / 1000).toFixed(0)}s`); } };
  await Promise.all(Array.from({ length: CONC }, worker));
  await browser.close();
})();
