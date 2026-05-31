const db = require('../../config/database');

const devolucionQueries = {

  getAll: () => db.query(`
    SELECT
      d.id, d.fecha_devolucion, d.observacion,
      d.estado_equipo,
      p.id   AS prestamo_id,
      u.nombre AS tecnico
    FROM devolucion d
    JOIN prestamo p ON p.id = d.prestamo_id
    JOIN usuario  u ON u.id = d.tecnico_id
    ORDER BY d.fecha_devolucion DESC
  `),

  getById: (id) => db.queryOne(`
    SELECT d.*, u.nombre AS tecnico
    FROM devolucion d
    JOIN prestamo p ON p.id = d.prestamo_id
    JOIN usuario  u ON u.id = d.tecnico_id
    WHERE d.id = $1
  `, [id]),

  create: ({ fecha_devolucion, observacion, estado_equipo, prestamo_id, tecnico_id }) => db.queryOne(`
    INSERT INTO devolucion (fecha_devolucion, observacion, estado_equipo, prestamo_id, tecnico_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [fecha_devolucion, observacion, estado_equipo, prestamo_id, tecnico_id]),

  update: (id, { observacion, estado_equipo }) => db.queryOne(`
    UPDATE devolucion SET
      observacion  = COALESCE($1, observacion),
      estado_equipo = COALESCE($2, estado_equipo)
    WHERE id = $3
    RETURNING *
  `, [observacion, estado_equipo, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM devolucion WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = devolucionQueries;