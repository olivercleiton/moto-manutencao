const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Debug: verificar se a pasta build existe
const buildPath = path.join(__dirname, 'build');
console.log('📁 Build path exists:', fs.existsSync(buildPath));
console.log('📁 Build directory contents:', fs.existsSync(buildPath) ? fs.readdirSync(buildPath) : 'BUILD FOLDER NOT FOUND');

// Servir arquivos estáticos
app.use(express.static(buildPath));

// Middleware para log de requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Todas as rotas vão para index.html (SPA)
app.get('*', (req, res) => {
  console.log(`🎯 SPA Fallback for: ${req.url}`);
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend rodando na porta ${PORT}`);
  console.log(`📊 Build directory: ${buildPath}`);
});