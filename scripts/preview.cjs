const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'maldongmu-site');
const port = Number(process.env.PORT || 5500);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer between 1 and 65535.');
  process.exit(1);
}

function isWithinRoot(file) {
  const relative = path.relative(root, file);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  let requested;
  try {
    requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  const file = path.resolve(root, `.${requested === '/' ? '/index.html' : requested}`);
  if (!isWithinRoot(file) || requested.includes('\0')) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const realFile = await fs.realpath(file);
    if (!isWithinRoot(realFile)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }
    const data = await fs.readFile(realFile);
    response.writeHead(200, {
      'Content-Type': types[path.extname(realFile)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Length': data.length,
    });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    response.writeHead(['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code) ? 404 : 500);
    response.end('File unavailable');
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is in use. Stop the other preview or choose a different PORT.`
    : error.message);
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Preview: http://127.0.0.1:${port}`);
  console.log('Uses the existing Google Sheets connection. Press Ctrl+C to stop.');
});
