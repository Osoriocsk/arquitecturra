const db = require('../../config/database');

const documentoEquipoQueries = {

  getAll: () => db.query(`
    SELECT
      d.id, d.nombre, d.tipo, d.ruta, d.fecha_subida,
      e.nombre AS equipo,
      u.nombre AS usuario
    FROM documento_equipo d
    JOIN equipo  e ON e.id = d.equipo_id
    JOIN usuario u ON u.id = d.usuario_id
    ORDER BY d.fecha_subida DESC
  `),

  getById: (id) => db.queryOne(`
    SELECT
      d.*,
      e.nombre AS equipo,
      u.nombre AS usuario
    FROM documento_equipo d
    JOIN equipo  e ON e.id = d.equipo_id
    JOIN usuario u ON u.id = d.usuario_id
    WHERE d.id = $1
  `, [id]),

  getByEquipo: (equipo_id) => db.query(`
    SELECT
      d.id, d.nombre, d.tipo, d.ruta, d.fecha_subida,
      u.nombre AS usuario
    FROM documento_equipo d
    JOIN usuario u ON u.id = d.usuario_id
    WHERE d.equipo_id = $1
    ORDER BY d.fecha_subida DESC
  `, [equipo_id]),

  create: ({ nombre, tipo, ruta, equipo_id, usuario_id }) => db.queryOne(`
    INSERT INTO documento_equipo (nombre, tipo, ruta, equipo_id, usuario_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [nombre, tipo, ruta, equipo_id, usuario_id]),

  update: (id, { nombre, tipo, ruta }) => db.queryOne(`
    UPDATE documento_equipo SET
      nombre = COALESCE($1, nombre),
      tipo   = COALESCE($2, tipo),
      ruta   = COALESCE($3, ruta)
    WHERE id = $4
    RETURNING *
  `, [nombre, tipo, ruta, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM documento_equipo WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = documentoEquipoQueries;