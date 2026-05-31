const db = require('../../config/database');

const mantenimientoQueries = {

  getAll: () => db.query(`
    SELECT
      m.id, m.tipo, m.estado, m.fecha_inicio, m.fecha_fin,
      m.descripcion, m.fecha_creacion,
      e.nombre AS equipo,
      u.nombre AS tecnico
    FROM mantenimiento m
    JOIN equipo  e ON e.id = m.equipo_id
    JOIN usuario u ON u.id = m.tecnico_id
    ORDER BY m.fecha_creacion DESC
  `),

  getById: (id) => db.queryOne(`
    SELECT
      m.*,
      e.nombre AS equipo,
      u.nombre AS tecnico
    FROM mantenimiento m
    JOIN equipo  e ON e.id = m.equipo_id
    JOIN usuario u ON u.id = m.tecnico_id
    WHERE m.id = $1
  `, [id]),

  create: ({ tipo, descripcion, fecha_inicio, fecha_fin, equipo_id, tecnico_id }) => db.queryOne(`
    INSERT INTO mantenimiento (tipo, descripcion, fecha_inicio, fecha_fin, equipo_id, tecnico_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [tipo, descripcion, fecha_inicio, fecha_fin, equipo_id, tecnico_id]),

  update: (id, { estado, descripcion, fecha_fin }) => db.queryOne(`
    UPDATE mantenimiento SET
      estado      = COALESCE($1, estado),
      descripcion = COALESCE($2, descripcion),
      fecha_fin   = COALESCE($3, fecha_fin)
    WHERE id = $4
    RETURNING *
  `, [estado, descripcion, fecha_fin, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM mantenimiento WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = mantenimientoQueries;