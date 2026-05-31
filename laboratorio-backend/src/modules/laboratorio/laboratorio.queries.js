// ─────────────────────────────────────────────────────────────
//  LABORATORIO — QUERIES SQL
// ─────────────────────────────────────────────────────────────
const db = require('../../config/database');

const laboratorioQueries = {

  getAll: () => db.query(`
    SELECT
      l.id, l.nombre, l.capacidad, l.ubicacion, l.estado,
      l.fecha_creacion, l.fecha_modificacion,
      s.nombre AS sede,
      u.nombre AS responsable
    FROM laboratorio l
    JOIN sede    s ON s.id = l.sede_id
    LEFT JOIN usuario u ON u.id = l.responsable_id
    ORDER BY s.nombre, l.nombre
  `),

  getById: (id) => db.queryOne(`
    SELECT
      l.*,
      s.nombre AS sede,
      u.nombre AS responsable
    FROM laboratorio l
    JOIN sede    s ON s.id = l.sede_id
    LEFT JOIN usuario u ON u.id = l.responsable_id
    WHERE l.id = $1
  `, [id]),

  create: ({ nombre, capacidad, ubicacion, sede_id, responsable_id }) => db.queryOne(`
    INSERT INTO laboratorio (nombre, capacidad, ubicacion, sede_id, responsable_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [nombre, capacidad, ubicacion, sede_id, responsable_id]),

  update: (id, { nombre, capacidad, ubicacion, estado, sede_id, responsable_id }) => db.queryOne(`
    UPDATE laboratorio SET
      nombre         = COALESCE($1, nombre),
      capacidad      = COALESCE($2, capacidad),
      ubicacion      = COALESCE($3, ubicacion),
      estado         = COALESCE($4, estado),
      sede_id        = COALESCE($5, sede_id),
      responsable_id = COALESCE($6, responsable_id)
    WHERE id = $7
    RETURNING *
  `, [nombre, capacidad, ubicacion, estado, sede_id, responsable_id, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM laboratorio WHERE id = $1 RETURNING id
  `, [id]),

  getByResponsable: (usuario_id) => db.query(`
    SELECT l.*, s.nombre AS sede
    FROM laboratorio l
    JOIN sede s ON s.id = l.sede_id
    WHERE l.responsable_id = $1
  `, [usuario_id]),
};

module.exports = laboratorioQueries;