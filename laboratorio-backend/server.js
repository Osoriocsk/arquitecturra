require('dotenv').config(); // Carga las variables de entorno PRIMERO

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀  Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦  Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗  API base: http://localhost:${PORT}/api/v1`);
});
