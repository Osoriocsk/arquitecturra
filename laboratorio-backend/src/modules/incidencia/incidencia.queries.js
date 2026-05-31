const db = require('../../config/database');

const incidenciaQueries = {

  getAll: () => db.query(`
    SELECT
      i.id, i.descripcion, i.fecha,
      i.usuario_id,
      i.prestamo_id,
      e.nombre AS equipo,
      u.nombre AS usuario
    FROM incidencia i
    JOIN equipo  e ON e.id = i.equipo_id
    JOIN usuario u ON u.id = i.usuario_id
    ORDER BY i.fecha DESC
  `),

  getById: (id) => db.queryOne(`
    SELECT
      i.*,
      e.nombre AS equipo,
      u.nombre AS usuario
    FROM incidencia i
    JOIN equipo  e ON e.id = i.equipo_id
    JOIN usuario u ON u.id = i.usuario_id
    WHERE i.id = $1
  `, [id]),

  create: ({ descripcion, prestamo_id, equipo_id, usuario_id }) => db.queryOne(`
    INSERT INTO incidencia (descripcion, prestamo_id, equipo_id, usuario_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [descripcion, prestamo_id, equipo_id, usuario_id]),

  update: (id, { descripcion }) => db.queryOne(`
    UPDATE incidencia SET
      descripcion = COALESCE($1, descripcion)
    WHERE id = $2
    RETURNING *
  `, [descripcion, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM incidencia WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = incidenciaQueries;