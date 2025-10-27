const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

console.log('🚀 Iniciando servidor HTTP nativo...');

const buildPath = path.join(__dirname, 'build');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  try {
    let filePath = req.url;
    
    // Health check
    if (filePath === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'OK', server: 'http-native' }));
    }
    
    // Rota raiz vai para index.html
    if (filePath === '/' || filePath === '/index.html') {
      filePath = '/index.html';
    }
    
    const fullPath = path.join(buildPath, filePath);
    const ext = path.extname(fullPath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Ler e servir arquivo
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        // Se arquivo não encontrado, servir index.html (SPA)
        if (err.code === 'ENOENT') {
          fs.readFile(path.join(buildPath, 'index.html'), (err, data) => {
            if (err) {
              res.writeHead(404);
              res.end('File not found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(data);
            }
          });
        } else {
          res.writeHead(500);
          res.end('Server error');
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  } catch (error) {
    console.error('❌ Erro no servidor:', error);
    res.writeHead(500);
    res.end('Internal server error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor HTTP rodando na porta ${PORT}`);
});

// Manter processo vivo
setInterval(() => {
  console.log('💓 Servidor ativo:', new Date().toISOString());
}, 60000);