// ─────────────────────────────────────────────────────────────
//  SEDE — QUERIES SQL
// ─────────────────────────────────────────────────────────────
const db = require('../../config/database');

const sedeQueries = {

  getAll: () => db.query(`
    SELECT id, nombre, ubicacion, fecha_creacion, fecha_modificacion
    FROM sede
    ORDER BY nombre
  `),

  getById: (id) => db.queryOne(`
    SELECT id, nombre, ubicacion, fecha_creacion, fecha_modificacion
    FROM sede
    WHERE id = $1
  `, [id]),

  create: ({ nombre, ubicacion }) => db.queryOne(`
    INSERT INTO sede (nombre, ubicacion)
    VALUES ($1, $2)
    RETURNING *
  `, [nombre, ubicacion]),

  update: (id, { nombre, ubicacion }) => db.queryOne(`
    UPDATE sede SET
      nombre    = COALESCE($1, nombre),
      ubicacion = COALESCE($2, ubicacion)
    WHERE id = $3
    RETURNING *
  `, [nombre, ubicacion, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM sede WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = sedeQueries;
