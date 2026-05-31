const db = require('../../config/database');

const reservaQueries = {

  getAll: () => db.query(`
    SELECT
      r.id, r.fecha_inicio, r.fecha_fin, r.estado, r.fecha_creacion,
      e.nombre AS equipo,
      r.solicitud_id
    FROM reserva r
    JOIN equipo e ON e.id = r.equipo_id
    ORDER BY r.fecha_creacion DESC
  `),

  getById: (id) => db.queryOne(`
    SELECT
      r.*,
      e.nombre AS equipo
    FROM reserva r
    JOIN equipo e ON e.id = r.equipo_id
    WHERE r.id = $1
  `, [id]),

  create: ({ fecha_inicio, fecha_fin, solicitud_id, equipo_id }) => db.queryOne(`
    INSERT INTO reserva (fecha_inicio, fecha_fin, solicitud_id, equipo_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [fecha_inicio, fecha_fin, solicitud_id, equipo_id]),

  update: (id, { estado, fecha_fin }) => db.queryOne(`
    UPDATE reserva SET
      estado    = COALESCE($1, estado),
      fecha_fin = COALESCE($2, fecha_fin)
    WHERE id = $3
    RETURNING *
  `, [estado, fecha_fin, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM reserva WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = reservaQueries;