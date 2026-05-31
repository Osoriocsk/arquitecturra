// ─────────────────────────────────────────────────────────────
//  CATEGORIA — QUERIES SQL
// ─────────────────────────────────────────────────────────────
const db = require('../../config/database');

const categoriaQueries = {

  getAll: () => db.query(`
    SELECT id, nombre, descripcion, fecha_creacion
    FROM categoria
    ORDER BY nombre
  `),

  getById: (id) => db.queryOne(`
    SELECT id, nombre, descripcion, fecha_creacion
    FROM categoria
    WHERE id = $1
  `, [id]),

  create: ({ nombre, descripcion }) => db.queryOne(`
    INSERT INTO categoria (nombre, descripcion)
    VALUES ($1, $2)
    RETURNING *
  `, [nombre, descripcion]),

  update: (id, { nombre, descripcion }) => db.queryOne(`
    UPDATE categoria SET
      nombre      = COALESCE($1, nombre),
      descripcion = COALESCE($2, descripcion)
    WHERE id = $3
    RETURNING *
  `, [nombre, descripcion, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM categoria WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = categoriaQueries;
