// ✅ COMENTE TEMPORARIAMENTE O FRONTEND:
// if (process.env.NODE_ENV === 'production') {
//   console.log('📁 Servindo frontend estático...');
//   app.use(express.static(path.join(__dirname, '../frontend')));
//   app.get(/^\/(?!api).*/, (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/index.html'));
//   });
// }

// ✅ DEIXE SÓ ESTA ROTA RAIZ SIMPLES:
app.get('/', (req, res) => {
  res.json({ 
    message: 'MotoManutenção Backend OK!',
    status: 'Online',
    timestamp: new Date().toISOString()
  });
});