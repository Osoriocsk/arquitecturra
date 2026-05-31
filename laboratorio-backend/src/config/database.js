const { Pool } = require('pg');

// ─────────────────────────────────────────────────────────────
//  CONEXIÓN A POSTGRESQL / SUPABASE
//
//  Usa DATABASE_URL si está definida (Render, Railway, Supabase).
//  Si no, usa las variables individuales (desarrollo local).
// ─────────────────────────────────────────────────────────────

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Requerido por Supabase y Render
      }
    : {
        host:     process.env.DB_HOST,
        port:     parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      }
);

// ── Verificar conexión al iniciar ─────────────────────────────
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌  Error al conectar con la base de datos:', err.message);
    return;
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      console.error('❌  Error en la consulta de prueba:', err.message);
      return;
    }
    console.log('✅  Conectado a PostgreSQL —', result.rows[0].now);
  });
});

// ── Helpers para ejecutar consultas ──────────────────────────
/**
 * Ejecuta una consulta SQL y devuelve todas las filas.
 * @param {string} text   - Consulta SQL con parámetros ($1, $2, ...)
 * @param {Array}  params - Valores de los parámetros
 * @returns {Promise<Array>}
 */
const query = (text, params) => pool.query(text, params);

/**
 * Ejecuta una consulta y devuelve solo la primera fila.
 * Útil para INSERT ... RETURNING, SELECT por ID, etc.
 */
const queryOne = async (text, params) => {
  const result = await pool.query(text, params);
  return result.rows[0] || null;
};

/**
 * Obtiene una conexión del pool para transacciones manuales.
 * Recuerda hacer client.release() al terminar.
 */
const getClient = () => pool.connect();

module.exports = { query, queryOne, getClient, pool };
