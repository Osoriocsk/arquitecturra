const db = require('../../config/database');

const solicitudEquipoQueries = {

  getAll: () => db.query(`
    SELECT
      se.id, se.cantidad,
      e.nombre AS equipo,
      se.solicitud_id
    FROM solicitud_equipo se
    JOIN equipo e ON e.id = se.equipo_id
    ORDER BY se.solicitud_id
  `),

  getById: (id) => db.queryOne(`
    SELECT
      se.*,
      e.nombre AS equipo
    FROM solicitud_equipo se
    JOIN equipo e ON e.id = se.equipo_id
    WHERE se.id = $1
  `, [id]),

  getBySolicitud: (solicitud_id) => db.query(`
    SELECT
      se.id, se.cantidad,
      e.id AS equipo_id, e.nombre AS equipo, e.codigo
    FROM solicitud_equipo se
    JOIN equipo e ON e.id = se.equipo_id
    WHERE se.solicitud_id = $1
  `, [solicitud_id]),

  create: ({ cantidad, solicitud_id, equipo_id }) => db.queryOne(`
    INSERT INTO solicitud_equipo (cantidad, solicitud_id, equipo_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [cantidad, solicitud_id, equipo_id]),

  update: (id, { cantidad }) => db.queryOne(`
    UPDATE solicitud_equipo SET
      cantidad = COALESCE($1, cantidad)
    WHERE id = $2
    RETURNING *
  `, [cantidad, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM solicitud_equipo WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = solicitudEquipoQueries;