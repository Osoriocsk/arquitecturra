const db = require('../../config/database');

const prestamoQueries = {

  getAll: () => db.query(`
    SELECT
      p.id, p.fecha_entrega, p.fecha_dev_esperada,
      p.estado, p.accesorios, p.fecha_creacion,
      u.nombre AS tecnico,
      s.id     AS solicitud_id
    FROM prestamo p
    JOIN solicitud s ON s.id = p.solicitud_id
    JOIN usuario   u ON u.id = p.tecnico_id
    ORDER BY p.fecha_creacion DESC
  `),

  getById: (id) => db.queryOne(`
    SELECT
      p.*,
      u.nombre AS tecnico
    FROM prestamo p
    JOIN solicitud s ON s.id = p.solicitud_id
    JOIN usuario   u ON u.id = p.tecnico_id
    WHERE p.id = $1
  `, [id]),

  create: ({ fecha_entrega, fecha_dev_esperada, accesorios, solicitud_id, tecnico_id }) => db.queryOne(`
    INSERT INTO prestamo (fecha_entrega, fecha_dev_esperada, accesorios, solicitud_id, tecnico_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [fecha_entrega, fecha_dev_esperada, accesorios, solicitud_id, tecnico_id]),

  update: (id, { estado, fecha_dev_esperada, accesorios }) => db.queryOne(`
    UPDATE prestamo SET
      estado           = COALESCE($1, estado),
      fecha_dev_esperada = COALESCE($2, fecha_dev_esperada),
      accesorios       = COALESCE($3, accesorios)
    WHERE id = $4
    RETURNING *
  `, [estado, fecha_dev_esperada, accesorios, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM prestamo WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = prestamoQueries;