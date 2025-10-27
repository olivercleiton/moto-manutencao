const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Log de inicialização
console.log('🚀 Iniciando servidor frontend...');
console.log('📁 Diretório atual:', __dirname);

// Verificar se a pasta build existe
const buildPath = path.join(__dirname, 'build');
try {
  if (!fs.existsSync(buildPath)) {
    console.error('❌ ERRO: Pasta build não encontrada!');
    console.log('📁 Conteúdo do diretório:', fs.readdirSync(__dirname));
    process.exit(1);
  }
  
  console.log('✅ Build encontrado:', fs.readdirSync(buildPath));
} catch (error) {
  console.error('❌ Erro ao verificar build:', error);
  process.exit(1);
}

// Middleware básico
app.use(express.json());
app.use(express.static(buildPath));

// Health check simples
app.get('/health', (req, res) => {
  console.log('✅ Health check recebido');
  res.json({ 
    status: 'OK', 
    message: 'Frontend funcionando',
    timestamp: new Date().toISOString()
  });
});

// Todas as outras rotas vão para o React
app.get('*', (req, res) => {
  try {
    console.log(`📥 Request recebido: ${req.method} ${req.url}`);
    res.sendFile(path.join(buildPath, 'index.html'));
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
  console.log(`🎉 Frontend rodando: http://0.0.0.0:${PORT}`);
  console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Recebido SIGTERM, encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado');
    process.exit(0);
  });
});

// Manter o processo vivo
setInterval(() => {
  console.log('💓 Heartbeat:', new Date().toISOString());
}, 30000); // Log a cada 30 segundos