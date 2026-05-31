// ─────────────────────────────────────────────────────────────
//  EQUIPO — QUERIES SQL
//  Toda interacción con la base de datos vive aquí.
//  Los controllers NUNCA escriben SQL directamente.
// ─────────────────────────────────────────────────────────────
const db = require('../../config/database');

const equipoQueries = {

  // ── Listar todos los equipos con info de laboratorio y categoría
 getAll: () => db.query(`
    SELECT
      e.id,
      e.nombre,
      e.serial,
      e.marca,
      e.modelo,
      e.estado,
      e.fecha_adquisicion,
      e.valor,
      e.vida_util,
      e.proveedor,
      e.laboratorio_id,
      c.nombre  AS categoria,
      l.nombre  AS laboratorio,
      s.nombre  AS sede
    FROM equipo e
    JOIN categoria   c ON c.id = e.categoria_id
    JOIN laboratorio l ON l.id = e.laboratorio_id
    JOIN sede        s ON s.id = l.sede_id
    ORDER BY l.nombre, e.nombre
  `),

  // ── Listar solo equipos disponibles
  getDisponibles: () => db.query(`
    SELECT * FROM v_equipos_disponibles
  `),

  // ── Buscar equipo por ID
  getById: (id) => db.queryOne(`
    SELECT
      e.*,
      c.nombre AS categoria,
      l.nombre AS laboratorio
    FROM equipo e
    JOIN categoria   c ON c.id = e.categoria_id
    JOIN laboratorio l ON l.id = e.laboratorio_id
    WHERE e.id = $1
  `, [id]),

  // ── Crear nuevo equipo
  create: ({ nombre, serial, marca, modelo, fecha_adquisicion, valor, vida_util, proveedor, laboratorio_id, categoria_id }) =>
    db.queryOne(`
      INSERT INTO equipo
        (nombre, serial, marca, modelo, fecha_adquisicion, valor, vida_util, proveedor, laboratorio_id, categoria_id)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [nombre, serial, marca, modelo, fecha_adquisicion, valor, vida_util, proveedor, laboratorio_id, categoria_id]),

  // ── Actualizar equipo
  update: (id, { nombre, serial, marca, modelo, estado, fecha_adquisicion, valor, vida_util, proveedor, laboratorio_id, categoria_id }) =>
    db.queryOne(`
      UPDATE equipo SET
        nombre           = COALESCE($1, nombre),
        serial           = COALESCE($2, serial),
        marca            = COALESCE($3, marca),
        modelo           = COALESCE($4, modelo),
        estado           = COALESCE($5, estado),
        fecha_adquisicion = COALESCE($6, fecha_adquisicion),
        valor            = COALESCE($7, valor),
        vida_util        = COALESCE($8, vida_util),
        proveedor        = COALESCE($9, proveedor),
        laboratorio_id   = COALESCE($10, laboratorio_id),
        categoria_id     = COALESCE($11, categoria_id)
      WHERE id = $12
      RETURNING *
    `, [nombre, serial, marca, modelo, estado, fecha_adquisicion, valor, vida_util, proveedor, laboratorio_id, categoria_id, id]),

  // ── Cambiar solo el estado del equipo
  updateEstado: (id, estado) =>
    db.queryOne(`
      UPDATE equipo SET estado = $1 WHERE id = $2 RETURNING *
    `, [estado, id]),

  // ── Eliminar equipo (solo si no tiene préstamos activos)
  delete: (id) =>
    db.queryOne(`
      DELETE FROM equipo WHERE id = $1 RETURNING id
    `, [id]),
};

module.exports = equipoQueries;
