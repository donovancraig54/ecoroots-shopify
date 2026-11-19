// Turns the static mirror in ./site into data for the React app.
//   node tools/extract.mjs
// Produces:
//   src/styles/theme.css      – theme CSS pulled from the original pages
//   src/data/icons.json       – SVG icon set + payment icons
//   src/data/products.json    – every product seen on any page
//   src/data/collections.json – collections (title, grid size, product order)
//   src/data/home.json        – product lists used on the homepage
//   public/assets/**          – only the asset files the app actually references
import fs from 'node:fs';
import path from 'node:path';

const SITE = path.resolve('site');
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
const write = (f, data) => {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  console.log('wrote', f);
};
const abs = (p) => (p && p.startsWith('assets/') ? '/' + p : p);
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const text = (s) => decode(s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, '');
// links in the mirror look like "products__x.html" – turn them into router paths
const route = (href) => {
  if (!href) return '#';
  if (href === 'index.html') return '/';
  const m = href.match(/^(collections|products|pages)__(.+)\.html$/);
  return m ? `/${m[1]}/${m[2]}` : href;
};
const fixHtml = (html) =>
  html
    .replace(/(src|href|data-src)="assets\//g, '$1="/assets/')
    .replace(/href="([^"]+\.html)"/g, (m, h) => `href="${route(h)}"`);

const pages = fs.readdirSync(SITE).filter((f) => f.endsWith('.html'));
const collectionPages = pages.filter((f) => f.startsWith('collections__'));
const productPages = pages.filter((f) => f.startsWith('products__'));

/* ---------------- CSS ---------------- */
const SKIP_CSS = [/#loadmore|my_load_more/, /function\s*\(/, /<link/, /#shopify-buyer-consent/, /\.waio_/, /\[x-sa-cloak\]/, /\.shopify-payment-button \{display: none;\}/];
const seen = new Set();
const cssBlocks = [];
for (const f of ['index.html', ...collectionPages, ...productPages]) {
  for (const m of read(f).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const css = m[1].trim();
    if (!css || seen.has(css) || SKIP_CSS.some((r) => r.test(css))) continue;
    seen.add(css);
    // some theme blocks are missing closing braces (browsers forgive this, PostCSS does not)
    const bare = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/"[^"]*"|'[^']*'/g, '');
    const open = (bare.match(/\{/g) || []).length - (bare.match(/\}/g) || []).length;
    cssBlocks.push(`/* from ${f} */\n${css}${open > 0 ? '}'.repeat(open) : ''}`);
  }
}
// product page stylesheet that is linked rather than inlined
const extraCss = ['assets/ecoroots.us/cdn/shop/t/113/assets/product.min.css'];
for (const rel of extraCss) {
  const p = path.join(SITE, rel);
  if (fs.existsSync(p)) {
    const dir = path.posix.dirname(rel);
    const css = fs.readFileSync(p, 'utf8').replace(/url\((['"]?)(?!data:|#|\/|https?:)([^'")]+)\1\)/g, (m, q, u) => `url(${q}/${path.posix.join(dir, u)}${q})`);
    cssBlocks.push(`/* ${rel} */\n${css}`);
  }
}
const themeCss = cssBlocks.join('\n\n').replace(/url\((['"]?)assets\//g, 'url($1/assets/');
write('src/styles/theme.css', themeCss);

/* ---------------- Icons ---------------- */
const icons = {};
let paymentIcons = [];
for (const f of ['index.html', ...productPages.slice(0, 1)]) {
  const html = read(f);
  for (const m of html.matchAll(/<svg\s+class="svg-icon icon-([a-z0-9-]+)\s*"([^>]*)>([\s\S]*?)<\/svg>/g)) {
    const [, name, attrStr, inner] = m;
    if (icons[name]) continue;
    const attrs = {};
    for (const a of attrStr.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    icons[name] = { attrs, inner: inner.replace(/\s*\n\s*/g, ' ').trim() };
  }
  if (!paymentIcons.length) {
    const foot = html.slice(html.indexOf('class="payment-options"'));
    paymentIcons = [...foot.slice(0, foot.indexOf('</ul>')).matchAll(/<li class="payment-icon">\s*([\s\S]*?)\s*<\/li>/g)].map((x) =>
      x[1].replace(/\s*\n\s*/g, ' '),
    );
  }
}
write('src/data/icons.json', { icons, paymentIcons });

/* ---------------- Product cards ---------------- */
const products = {};
function parseCards(html) {
  const handles = [];
  const chunks = stripComments(html).split(/<li\s+class="\s*product\s+product-/).slice(1);
  for (const c of chunks) {
    const id = c.match(/^(\d+)/)?.[1];
    const handle = c.match(/product_handle="([^"]+)"/)?.[1];
    if (!handle) continue;
    const images = [...c.matchAll(/data-rimg-template="([^"]+)"/g)].map((m) => abs(m[1]));
    const title = text(c.match(/<h2 class="title">([\s\S]*?)<\/h2>/)?.[1] || '');
    const priceBlock = c.match(/<p class="price([^"]*)">([\s\S]*?)<\/p>/);
    const compare = priceBlock?.[2].match(/<span class="original money">([^<]*)<\/span>/)?.[1]?.trim() || null;
    const price = priceBlock ? text(priceBlock[2].replace(/<span class="original money">[^<]*<\/span>/, '')) : '';
    const badgeWrap = c.match(/<div class="badges-wrapper">([\s\S]*?)<\/div>/)?.[1] || '';
    const badges = [...badgeWrap.matchAll(/<span class="badge ([^"]+)">([^<]*)<\/span>/g)].map((m) => ({ cls: m[1], label: m[2].trim() }));
    const card = {
      id,
      handle,
      title,
      images,
      price,
      compareAt: compare,
      onSale: /sale/.test(priceBlock?.[1] || ''),
      badges,
      variantId: c.match(/data-product-variant-id="(\d+)"/)?.[1] || null,
      quickshop: c.includes('data-product-card-interaction-quickshop'),
      rating: Number(c.match(/data-average-rating='([^']+)'/)?.[1] || 0),
      reviews: Number(c.match(/data-number-of-reviews='([^']+)'/)?.[1] || 0),
    };
    products[handle] = { ...(products[handle] || {}), ...card };
    if (!handles.includes(handle)) handles.push(handle);
  }
  return handles;
}

/* ---------------- Homepage lists ---------------- */
const index = read('index.html');
const section = (html, id) => {
  const start = html.indexOf(`id="shopify-section-${id}"`);
  const next = html.indexOf('id="shopify-section-', start + 10);
  return html.slice(start, next === -1 ? undefined : next);
};
write('src/data/home.json', {
  mostLoved: parseCards(section(index, 'dynamic-collection')),
  shopMore: parseCards(section(index, '1543265782218')),
});

/* ---------------- Collections ---------------- */
const collections = {};
for (const f of collectionPages) {
  const handle = f.replace(/^collections__|\.html$/g, '');
  const page = read(f);
  const secId = page.match(/id="shopify-section-([^"]*static-collection[^"]*)"/)?.[1] || 'static-collection';
  const html = section(page, secId);
  const h1 = page.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1];
  collections[handle] = {
    handle,
    title: text(html.match(/<h1 class="label"[^>]*>([\s\S]*?)<\/h1>/)?.[1] || h1 || handle),
    rowOf: Number(html.match(/product-list row-of-(\d)/)?.[1] || 3),
    products: parseCards(html),
  };
}
write('src/data/collections.json', collections);

/* ---------------- Product detail pages ---------------- */
// Find a product JSON object embedded anywhere in the page (theme JSON, app scripts, …)
function findProductJson(html, handle) {
  const re = /\{"id":(\d+),"title":"/g;
  let m;
  while ((m = re.exec(html))) {
    let depth = 0;
    let inStr = false;
    for (let i = m.index; i < html.length; i++) {
      const ch = html[i];
      if (inStr) {
        if (ch === '\\') i++;
        else if (ch === '"') inStr = false;
      } else if (ch === '"') inStr = true;
      else if (ch === '{') depth++;
      else if (ch === '}' && --depth === 0) {
        try {
          const obj = JSON.parse(html.slice(m.index, i + 1));
          if (obj.handle === handle && Array.isArray(obj.variants)) return obj;
        } catch {}
        break;
      }
    }
  }
  return null;
}
const imgKey = (src) =>
  path.posix
    .basename(src)
    .replace(/__[0-9a-f]{8}(?=\.)/, '')
    .replace(/_(\d+x\d*|x\d+)(_crop_center)?(?=[._])/g, '')
    .replace(/_crop_center/g, '')
    .replace(/\.[a-z]+$/i, '');
const imgSize = (src) => Number(src.match(/_(\d+)x/)?.[1] || 1e5); // un-sized original = biggest

for (const f of productPages) {
  const html = read(f);
  const handle = f.replace(/^products__|\.html$/g, '');
  const themeJson = html.match(/data-section-type="dynamic-product"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  const p = (themeJson && JSON.parse(themeJson).product) || findProductJson(html, handle);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((x) => {
      try {
        return JSON.parse(x[1]);
      } catch {
        return null;
      }
    })
    .find((x) => x && x['@type'] === 'Product');
  if (!p && !ld) {
    console.warn('no product data in', f);
    continue;
  }
  // main product section = first section after the header
  const sections = html.split(/(?=<div id="shopify-section-)/);
  const mainSec = sections.find((s) => /shopify-section-template--[^"]*(product)/i.test(s.slice(0, 200))) || html;
  const main = mainSec.slice(Math.max(0, mainSec.indexOf('product-details')));

  // gallery: product JSON images if local, else every product image in the main section, deduped by base name
  const title = p?.title || ld?.name;
  const candidates = [
    ...(p?.images || []).filter((s) => s.startsWith('assets/')),
    ...[...mainSec.matchAll(/(?:data-src|src|data-high-res-url)="(assets\/[^"]+\.(?:jpe?g|png|webp|avif))"/g)].map((x) => x[1]),
  ].filter((s) => /\/cdn\/shop\/(files|products)\//.test(s) && !/_100x|_50x|icon|logo|badge|free-delivery|clock/i.test(s));
  const byKey = new Map();
  for (const s of candidates) {
    if (!fs.existsSync(path.join(SITE, s))) continue;
    const k = imgKey(s);
    const cur = byKey.get(k);
    // prefer ~1000-2000px variants over the 5MB originals
    const score = (x) => -Math.abs(Math.min(imgSize(x), 4000) - 1200);
    if (!cur || score(s) > score(cur)) byKey.set(k, s);
  }
  const gallery = [...byKey.values()].map((s) => ({ main: abs(s), thumb: abs(s) }));

  const faq = [...main.matchAll(/<h2 class="faq-heading">([\s\S]*?)<\/h2>[\s\S]*?<div class="faq-content"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g)].map((m) => ({
    heading: text(m[1]),
    html: fixHtml(m[2].trim()),
  }));
  const featureIcons = [...main.matchAll(/<div class="feature-item">\s*<img src="([^"]+)"[^>]*>\s*<span>([^<]*)<\/span>/g)].map((m) => ({
    icon: abs(m[1]),
    label: m[2].trim(),
  }));
  const featureList = [...(main.match(/<ul class="feature-list">([\s\S]*?)<\/ul>/)?.[1] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => text(m[1]));
  const variants = p
    ? p.variants.map((v) => ({ id: String(v.id), title: v.title, options: v.options, price: v.price, compareAt: v.compare_at_price, available: v.available }))
    : [].concat(ld.offers || []).map((o, i) => ({
        id: o.url?.match(/variant=(\d+)/)?.[1] || String(i),
        title: o.name || 'Default Title',
        options: [o.name || 'Default Title'],
        price: Math.round(Number(o.price) * 100),
        compareAt: null,
        available: /InStock/.test(o.availability || ''),
      }));
  const card = products[handle] || {};
  products[handle] = {
    ...card,
    id: String(p?.id || card.id || ''),
    handle,
    title,
    detail: {
      description: fixHtml(p?.description || (ld?.description ? `<p>${ld.description}</p>` : '')),
      quote: text(main.match(/<p class="Product-details__quote">([\s\S]*?)<\/p>/)?.[1] || ''),
      variants,
      options: p?.options || (variants.length > 1 ? ['Style'] : ['Title']),
      gallery: gallery.length ? gallery : (card.images || []).map((s) => ({ main: s, thumb: s })),
      featureIcons,
      featureList,
      faq,
    },
  };
  products[handle].images ||= gallery.slice(0, 2).map((g) => g.main);
  if (!products[handle].price && variants[0]) products[handle].price = '$' + (variants[0].price / 100).toFixed(2);
  console.log(`  product ${handle}: ${gallery.length} images, ${variants.length} variants, ${faq.length} faq`);
}
// products with only card data get a minimal detail block so their page still renders
for (const p of Object.values(products)) {
  if (p.detail) continue;
  const cents = Math.round(Number(String(p.price).replace(/[^0-9.]/g, '')) * 100) || 0;
  const cmp = p.compareAt ? Math.round(Number(String(p.compareAt).replace(/[^0-9.]/g, '')) * 100) : null;
  p.detail = {
    description: '',
    quote: '',
    variants: [{ id: p.variantId || p.id, title: 'Default Title', options: ['Default Title'], price: cents, compareAt: cmp, available: true }],
    options: ['Title'],
    gallery: (p.images || []).map((s) => ({ main: s, thumb: s })),
    featureIcons: [],
    featureList: [],
    faq: [],
    partial: true,
  };
}
write('src/data/products.json', products);

/* ---------------- Copy referenced assets into public/ ---------------- */
const referenced = new Set();
const scan = (s) => {
  for (const m of s.matchAll(/\/?(assets\/[^"'()\s,\\]+)/g)) referenced.add(decodeURIComponent(m[1]));
};
scan(themeCss);
for (const f of ['src/data/products.json', 'src/data/icons.json']) scan(fs.readFileSync(f, 'utf8'));
const walk = (d) =>
  fs.existsSync(d)
    ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))
    : [];
// Source files build paths by concatenation, so match by file name against the mirror instead.
const byBase = new Map();
for (const f of walk(path.join(SITE, 'assets'))) {
  const rel = path.relative(SITE, f).split(path.sep).join('/');
  const base = path.basename(f);
  if (!byBase.has(base)) byBase.set(base, []);
  byBase.get(base).push(rel);
}
for (const f of walk('src').filter((f) => /\.(jsx?|css)$/.test(f) && !f.endsWith('theme.css'))) {
  const src = fs.readFileSync(f, 'utf8');
  scan(src);
  for (const m of src.matchAll(/[\w.()%-]+\.(?:png|jpe?g|webp|avif|gif|svg|woff2?)/gi)) {
    for (const rel of byBase.get(m[0]) || []) referenced.add(rel);
  }
  // responsive('stem', 'ext') -> every stem__<hash>.ext width variant
  for (const m of src.matchAll(/responsive\(\s*'([^']+)',\s*'(\w+)'\s*\)/g)) {
    const re = new RegExp(`^${m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}__[0-9a-f]{8}\\.${m[2]}$`);
    for (const [base, rels] of byBase) if (re.test(base)) rels.forEach((r) => referenced.add(r));
  }
}

let copied = 0;
let missing = 0;
for (const rel of referenced) {
  const from = path.join(SITE, rel);
  const to = path.join('public', rel);
  if (!fs.existsSync(from)) {
    missing++;
    continue;
  }
  if (!fs.existsSync(to)) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
  copied++;
}
console.log(`assets: ${copied} copied/present, ${missing} referenced but not in mirror`);
