const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Log de inicialização
console.log('🚀 Iniciando servidor frontend...');
console.log('📁 Diretório atual:', __dirname);
console.log('📁 Conteúdo da pasta public:');

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
    console.log('✅ Health check recebido');
    res.json({ 
        status: 'OK', 
        message: 'Frontend funcionando',
        timestamp: new Date().toISOString()
    });
});

// Todas as rotas vão para o React
app.get('*', (req, res) => {
    try {
        console.log(`📥 Request recebido: ${req.method} ${req.url}`);
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        console.error('❌ Erro ao servir index.html:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎉 Frontend rodando: http://0.0.0.0:${PORT}`);
    console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
});