const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// USAR A PORTA DO RAILWAY (importante!)
const PORT = process.env.PORT || 3000;

// Log de inicialização
console.log('🚀 Iniciando servidor frontend em modo desenvolvimento...');
console.log('📁 Diretório atual:', __dirname);

// Middleware básico
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Servir também da pasta src se necessário
app.use('/src', express.static(path.join(__dirname, 'src')));

// Health check simples
app.get('/health', (req, res) => {
  console.log('✅ Health check recebido');
  res.json({ 
    status: 'OK', 
    message: 'Frontend funcionando em modo desenvolvimento',
    timestamp: new Date().toISOString()
  });
});

// Rota principal - servir o index.html
app.get('/', (req, res) => {
  try {
    console.log('📥 Request recebido para /');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('❌ Erro ao servir index.html:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Todas as outras rotas vão para o React
app.get('*', (req, res) => {
  try {
    console.log(`📥 Request recebido: ${req.method} ${req.url}`);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('❌ Erro ao servir index.html:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Tratamento de erros global
app.use((error, req, res, next) => {
  console.error('❌ Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 Frontend rodando: http://localhost:${PORT}`);
  console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
  console.log(`📁 Servindo arquivos de: ${__dirname}/public`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Recebido SIGTERM, encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado');
    process.exit(0);
  });
});