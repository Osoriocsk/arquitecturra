const devolucionQueries = require('./devolucion.queries');
const { createError }   = require('../../middlewares/errorHandler');
const db                = require('../../config/database');

const devolucionController = {

  getAll: async (req, res, next) => {
    try {
      const { rows } = await devolucionQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const dev = await devolucionQueries.getById(req.params.id);
      if (!dev) throw createError('Devolución no encontrada', 404);
      res.json({ ok: true, data: dev });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const dev = await devolucionQueries.create(req.body)

      // 1. Cambiar préstamo a devuelto
      await db.query(`
        UPDATE prestamo SET estado = 'devuelto'
        WHERE id = $1
      `, [req.body.prestamo_id])

      // 2. Obtener equipos del préstamo y cambiarlos a disponible
      const { rows: equipos } = await db.query(`
        SELECT se.equipo_id
        FROM prestamo p
        JOIN solicitud_equipo se ON se.solicitud_id = p.solicitud_id
        WHERE p.id = $1
      `, [req.body.prestamo_id])

      if (equipos.length > 0) {
        await db.query(`
          UPDATE equipo SET estado = 'disponible'
          WHERE id = ANY($1::int[])
        `, [equipos.map(e => e.equipo_id)])
      }

      // 3. Cambiar solicitud a completada
      const { rows: prestamo } = await db.query(`
        SELECT solicitud_id FROM prestamo WHERE id = $1
      `, [req.body.prestamo_id])

      if (prestamo.length > 0) {
        await db.query(`
          UPDATE solicitud SET estado = 'completada'
          WHERE id = $1
        `, [prestamo[0].solicitud_id])

        // 4. Cambiar reserva a completada
        await db.query(`
          UPDATE reserva SET estado = 'completada'
          WHERE solicitud_id = $1
        `, [prestamo[0].solicitud_id])
      }

      res.status(201).json({ ok: true, message: 'Devolución registrada', data: dev })
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const dev = await devolucionQueries.update(req.params.id, req.body);
      if (!dev) throw createError('Devolución no encontrada', 404);
      res.json({ ok: true, message: 'Devolución actualizada', data: dev });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await devolucionQueries.delete(req.params.id);
      if (!deleted) throw createError('Devolución no encontrada', 404);
      res.json({ ok: true, message: 'Devolución eliminada', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = devolucionController;    