const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Verificar se a pasta build existe
const fs = require('fs');
const buildPath = path.join(__dirname, 'build');

if (!fs.existsSync(buildPath)) {
  console.error('❌ ERRO: Pasta build não encontrada!');
  console.log('📁 Conteúdo atual:', fs.readdirSync(__dirname));
  process.exit(1);
}

console.log('✅ Build encontrado:', fs.readdirSync(buildPath));

// Servir arquivos estáticos
app.use(express.static(buildPath));

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Frontend funcionando' });
});

// Todas as outras rotas vão para o React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Frontend rodando: http://0.0.0.0:${PORT}`);
});