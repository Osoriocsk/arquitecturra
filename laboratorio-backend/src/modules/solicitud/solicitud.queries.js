const db = require('../../config/database');

const solicitudQueries = {

  getAll: () => db.query(`
    SELECT
      s.id, s.fecha_inicio, s.fecha_fin, s.estado,
      s.observacion, s.motivo_rechazo, s.fecha_creacion,
      s.usuario_id,
      u.nombre AS usuario
    FROM solicitud s
    JOIN usuario u ON u.id = s.usuario_id
    ORDER BY s.fecha_creacion DESC
  `),

  getById: (id) => db.queryOne(`
    SELECT
      s.*,
      u.nombre AS usuario
    FROM solicitud s
    JOIN usuario u ON u.id = s.usuario_id
    WHERE s.id = $1
  `, [id]),

  create: ({ fecha_inicio, fecha_fin, observacion, usuario_id }) => db.queryOne(`
    INSERT INTO solicitud (fecha_inicio, fecha_fin, observacion, usuario_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [fecha_inicio, fecha_fin, observacion, usuario_id]),

  update: (id, { estado, observacion, motivo_rechazo, fecha_fin }) => db.queryOne(`
    UPDATE solicitud SET
      estado         = COALESCE($1, estado),
      observacion    = COALESCE($2, observacion),
      motivo_rechazo = COALESCE($3, motivo_rechazo),
      fecha_fin      = COALESCE($4, fecha_fin)
    WHERE id = $5
    RETURNING *
  `, [estado, observacion, motivo_rechazo, fecha_fin, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM solicitud WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = solicitudQueries;