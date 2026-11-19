// Static frontend mirror for a Shopify storefront.
// Usage: node tools/mirror.mjs [pagePath ...]   (default: "/")
// Output: ./site/  (open site/index.html or serve the folder)
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ORIGIN = 'https://ecoroots.us';
const OUT = path.resolve('site');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const ASSET_HOSTS = ['ecoroots.us', 'cdn.shopify.com'];
const ASSET_EXT = /\.(css|js|png|jpe?g|gif|webp|svg|avif|ico|woff2?|ttf|otf|eot|mp4|webm)$/i;
const RIMG_SIZE = '800x800';

// Third-party / analytics / app scripts to drop (frontend only, no tracking).
const DROP_SRC = [
  'attn.tv', 'klaviyo', 'googletagmanager', 'google-analytics', 'config-security', 'awin',
  'monorail', 'shop.app', '/checkouts/internal', 'shop-js/modules', 'appstle', 'wholesale',
  'trekkie', 'origin_trials', 'shopify_pay', 'load_feature', 'portable-wallets', 'standard-actions',
  'facebook', 'pinterest', 'pintrk', 'tiktok', 'hotjar', 'clarity', 'web-pixels', 'perf-kit',
];
const DROP_INLINE = [
  'trekkie', 'ShopifyAnalytics', 'monorail', 'attn.tv', 'attentive', 'klaviyo', 'gtag(', 'dataLayer',
  'fbq(', 'pintrk', 'ttq.', 'web-pixels', 'webPixelsManager', 'awin', 'config-security', 'hotjar',
  'appstle', 'shop.app', 'PaypalV4', 'perf-kit', 'clarity',
];

const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const pageFile = (p) => {
  const clean = p.replace(/[?#].*$/, '').replace(/\/+$/, '');
  return clean === '' ? 'index.html' : clean.slice(1).replace(/\//g, '__') + '.html';
};
const mirrored = new Map(pages.map((p) => [p.replace(/\/+$/, '') || '/', pageFile(p)]));

const downloaded = new Map(); // remote url -> local rel path (or null on failure)

async function get(url, binary = false) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*', cookie: 'localization=US; cart_currency=USD' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return binary ? Buffer.from(await r.arrayBuffer()) : await r.text();
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise((res) => setTimeout(res, 500 * (attempt + 1)));
    }
  }
}

function localPathFor(u) {
  const url = new URL(u);
  let p = decodeURIComponent(url.pathname);
  // keep resize params (width/height/crop) as part of the filename
  const params = [...url.searchParams].filter(([k]) => k !== 'v');
  if (params.length) {
    const tag = crypto.createHash('md5').update(params.map((x) => x.join('=')).join('&')).digest('hex').slice(0, 8);
    const ext = path.extname(p);
    p = p.slice(0, p.length - ext.length) + '__' + tag + ext;
  }
  p = p.replace(/[<>:"|?*]/g, '_');
  return path.posix.join('assets', url.hostname, p);
}

async function download(u) {
  if (downloaded.has(u)) return downloaded.get(u);
  const rel = localPathFor(u);
  downloaded.set(u, rel);
  const abs = path.join(OUT, rel);
  try {
    await fs.access(abs);
  } catch {
    try {
      const isCss = /\.css$/i.test(new URL(u).pathname);
      let data = await get(u, !isCss);
      if (isCss) data = await rewriteCss(data, u, rel);
      await fs.mkdir(path.dirname(abs), { recursive: true });
      await fs.writeFile(abs, data);
      console.log('  +', rel);
    } catch (e) {
      console.warn('  ! failed', u, e.message);
      downloaded.set(u, null);
    }
  }
  return downloaded.get(u);
}

function normalize(raw, base) {
  let s = raw.replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
  if (s.startsWith('//')) s = 'https:' + s;
  try {
    return new URL(s, base).href;
  } catch {
    return null;
  }
}

function isAsset(abs) {
  try {
    const u = new URL(abs);
    return ASSET_HOSTS.includes(u.hostname) && ASSET_EXT.test(u.pathname);
  } catch {
    return false;
  }
}

async function rewriteCss(css, cssUrl, cssRel) {
  const re = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
  const jobs = [];
  css.replace(re, (m, q, ref) => {
    if (ref.startsWith('data:') || ref.startsWith('#')) return m;
    const abs = normalize(ref, cssUrl);
    if (abs && isAsset(abs)) jobs.push(download(abs).then((rel) => [ref, rel]));
    return m;
  });
  const map = new Map(await Promise.all(jobs));
  return css.replace(re, (m, q, ref) => {
    const rel = map.get(ref);
    if (!rel) return m;
    return `url(${q}${path.posix.relative(path.posix.dirname(cssRel), rel)}${q})`;
  });
}

function stripTracking(html) {
  // external scripts
  html = html.replace(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (m, src) =>
    DROP_SRC.some((k) => src.includes(k)) ? '' : m);
  // inline scripts
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (m, attrs, body) => {
    if (/\bsrc=/.test(attrs)) return m;
    return DROP_INLINE.some((k) => body.includes(k)) ? '' : m;
  });
  // preconnect / prefetch / preload hints to third parties, tracking iframes & pixels
  html = html.replace(/<link\b[^>]*rel=["'](?:dns-prefetch|preconnect)["'][^>]*>/gi, '');
  html = html.replace(/<link\b[^>]*href=["'][^"']*(?:monorail|shop\.app|attn\.tv|klaviyo|wholesale|portable-wallets)[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<noscript>\s*<img[^>]*(?:facebook|pinterest|tiktok)[^>]*>\s*<\/noscript>/gi, '');
  html = html.replace(/<link\b[^>]*rel=["'](?:ucp|alternate)["'][^>]*>/gi, '');
  return html;
}

function rewriteLinks(html, fileRel) {
  return html.replace(/(href|action)=(["'])([^"']*)\2/gi, (m, attr, q, val) => {
    if (/^(#|mailto:|tel:|javascript:|data:)/i.test(val) || val.startsWith('assets/')) return m;
    let u;
    try {
      u = new URL(val.replace(/&amp;/g, '&'), ORIGIN);
    } catch {
      return m;
    }
    if (u.hostname !== 'ecoroots.us') return m; // social links etc.
    const key = u.pathname.replace(/\/+$/, '') || '/';
    const local = mirrored.get(key);
    if (local) return `${attr}=${q}${path.posix.relative(path.posix.dirname(fileRel), local) || local}${q}`;
    if (attr.toLowerCase() === 'action') return `${attr}=${q}#${q}`;
    return `${attr}=${q}#${q}`; // page not mirrored – keep frontend self-contained
  });
}

async function mirrorPage(p) {
  const fileRel = pageFile(p);
  console.log(`\n== ${p} -> site/${fileRel}`);
  let html = await get(ORIGIN + p);
  html = stripTracking(html);

  // responsive-image templates: pin to one size so the theme's lazy loader always hits a local file
  html = html.replace(/(data-rimg-template=["'])([^"']+)(["'])/g, (m, a, t, b) => a + t.replace('{size}', RIMG_SIZE) + b);

  // collect every asset URL (plain, protocol-relative, JSON-escaped)
  const urlRe = /(?:https?:)?(?:\\?\/){2}(?:ecoroots\.us|cdn\.shopify\.com)(?:\\?\/[^\s"'<>()\\,]*)+(?:\?[^\s"'<>()\\,]*)?|(?<=["'(\s,])\/cdn\/shop[^\s"'<>()\\,]+/g;
  const found = new Set(html.match(urlRe) || []);
  const replacements = new Map();
  await Promise.all(
    [...found].map(async (raw) => {
      const abs = normalize(raw, ORIGIN);
      if (!abs || !isAsset(abs)) return;
      const rel = await download(abs);
      if (rel) {
        const out = path.posix.relative(path.posix.dirname(fileRel), rel) || rel;
        replacements.set(raw, raw.includes('\\/') ? out.replace(/\//g, '\\/') : out);
      }
    }),
  );
  // longest first so substrings don't clobber longer matches
  for (const raw of [...replacements.keys()].sort((a, b) => b.length - a.length)) {
    html = html.split(raw).join(replacements.get(raw));
  }

  html = rewriteLinks(html, fileRel);
  html = html.replace(/<base\b[^>]*>/gi, '');
  await fs.mkdir(path.dirname(path.join(OUT, fileRel)), { recursive: true });
  await fs.writeFile(path.join(OUT, fileRel), html);
  console.log(`   wrote site/${fileRel} (${(html.length / 1024).toFixed(0)} KB)`);
}

await fs.mkdir(OUT, { recursive: true });
for (const p of pages) await mirrorPage(p);
const failed = [...downloaded].filter(([, v]) => v === null);
console.log(`\nDone. ${downloaded.size - failed.length} assets saved, ${failed.length} failed.`);
