const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const sql = fs.readFileSync(path.join(__dirname, 'init_db.sql')).toString();

(async () => {
  try {
    await pool.query(sql);
    console.log('✅ Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
  } finally {
    pool.end();
  }
})();
