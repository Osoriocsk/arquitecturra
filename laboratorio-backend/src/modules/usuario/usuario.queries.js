// ─────────────────────────────────────────────────────────────
//  USUARIO — QUERIES SQL
// ─────────────────────────────────────────────────────────────
const db = require('../../config/database');

const usuarioQueries = {

  getAll: () => db.query(`
    SELECT
      u.id, u.nombre, u.correo, u.estado,
      u.fecha_creacion, u.fecha_modificacion,
      r.nombre AS rol
    FROM usuario u
    JOIN rol r ON r.id = u.rol_id
    ORDER BY u.nombre
  `),

  getById: (id) => db.queryOne(`
    SELECT
      u.id, u.nombre, u.correo, u.estado,
      u.fecha_creacion, u.fecha_modificacion,
      r.nombre AS rol
    FROM usuario u
    JOIN rol r ON r.id = u.rol_id
    WHERE u.id = $1
  `, [id]),

  create: ({ nombre, correo, contrasena, rol_id }) => db.queryOne(`
    INSERT INTO usuario (nombre, correo, contrasena, rol_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nombre, correo, estado, rol_id, fecha_creacion
  `, [nombre, correo, contrasena, rol_id]),

  update: (id, { nombre, correo, estado, rol_id }) => db.queryOne(`
    UPDATE usuario SET
      nombre  = COALESCE($1, nombre),
      correo  = COALESCE($2, correo),
      estado  = COALESCE($3, estado),
      rol_id  = COALESCE($4, rol_id)
    WHERE id = $5
    RETURNING id, nombre, correo, estado, rol_id, fecha_modificacion
  `, [nombre, correo, estado, rol_id, id]),

  delete: (id) => db.queryOne(`
    DELETE FROM usuario WHERE id = $1 RETURNING id
  `, [id]),
};

module.exports = usuarioQueries;