// Minimal local static server (127.0.0.1 only).
//   node tools/serve.mjs [dir=dist] [port=8080]
// Unknown paths fall back to index.html so React Router deep links work.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || 'dist');
const PORT = Number(process.argv[3]) || 8080;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4',
};

const send = (res, file) =>
  fs.readFile(file, (err, data) => {
    if (err) return res.writeHead(404).end('Not found');
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });

http
  .createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    fs.stat(file, (err, st) => {
      if (!err && st.isFile()) return send(res, file);
      // SPA fallback for routes like /products/xyz (but not for missing assets)
      if (!path.extname(p)) return send(res, path.join(ROOT, 'index.html'));
      res.writeHead(404).end('Not found');
    });
  })
  .listen(PORT, '127.0.0.1', () => console.log(`Serving ${ROOT} at http://127.0.0.1:${PORT}`));
