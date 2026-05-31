const db = require('../../config/database');

const historialQueries = {

  getAll: () => db.query(`
    SELECT
      h.id, h.fecha, h.tipo_accion, h.observacion,
      e.nombre AS equipo,
      u.nombre AS usuario
    FROM historial h
    JOIN equipo  e ON e.id = h.equipo_id
    JOIN usuario u ON u.id = h.usuario_id
    ORDER BY h.fecha DESC
  `),

  getById: (id) => db.queryOne(`
    SELECT
      h.*,
      e.nombre AS equipo,
      u.nombre AS usuario
    FROM historial h
    JOIN equipo  e ON e.id = h.equipo_id
    JOIN usuario u ON u.id = h.usuario_id
    WHERE h.id = $1
  `, [id]),

  create: ({ tipo_accion, observacion, equipo_id, usuario_id }) => db.queryOne(`
    INSERT INTO historial (tipo_accion, observacion, equipo_id, usuario_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [tipo_accion, observacion, equipo_id, usuario_id]),

  delete: (id) => db.queryOne(`
    DELETE FROM historial WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = historialQueries;