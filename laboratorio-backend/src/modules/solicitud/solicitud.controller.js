const solicitudQueries = require('./solicitud.queries');
const { createError }  = require('../../middlewares/errorHandler');
const db               = require('../../config/database');

const solicitudController = {

  getAll: async (req, res, next) => {
    try {
      const { rows } = await solicitudQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const solicitud = await solicitudQueries.getById(req.params.id);
      if (!solicitud) throw createError('Solicitud no encontrada', 404);
      res.json({ ok: true, data: solicitud });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const solicitud = await solicitudQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Solicitud creada', data: solicitud });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const solicitud = await solicitudQueries.update(req.params.id, req.body)
      if (!solicitud) throw createError('Solicitud no encontrada', 404)

      if (req.body.estado === 'aprobada') {
        const { rows: equipos } = await db.query(`
          SELECT equipo_id FROM solicitud_equipo
          WHERE solicitud_id = $1
        `, [req.params.id])

        if (equipos.length > 0) {
          await db.queryOne(`
            INSERT INTO prestamo (fecha_entrega, fecha_dev_esperada, estado, solicitud_id)
            VALUES (NOW(), $1, 'activo', $2)
            RETURNING *
          `, [solicitud.fecha_fin, req.params.id])

          await db.query(`
            UPDATE equipo SET estado = 'prestado'
            WHERE id = ANY($1::int[])
          `, [equipos.map(e => e.equipo_id)])
        }

        // Actualizar reserva a activa
        await db.query(`
          UPDATE reserva SET estado = 'activa'
          WHERE solicitud_id = $1
        `, [req.params.id])
      }

      if (req.body.estado === 'rechazada' || req.body.estado === 'cancelada') {
        const { rows: equipos } = await db.query(`
          SELECT equipo_id FROM solicitud_equipo
          WHERE solicitud_id = $1
        `, [req.params.id])

        if (equipos.length > 0) {
          await db.query(`
            UPDATE equipo SET estado = 'disponible'
            WHERE id = ANY($1::int[])
          `, [equipos.map(e => e.equipo_id)])
        }

        // Actualizar reserva a cancelada
        await db.query(`
          UPDATE reserva SET estado = 'cancelada'
          WHERE solicitud_id = $1
        `, [req.params.id])
      }

      res.json({ ok: true, message: 'Solicitud actualizada', data: solicitud })
    } catch (err) { next(err) }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await solicitudQueries.delete(req.params.id);
      if (!deleted) throw createError('Solicitud no encontrada', 404);
      res.json({ ok: true, message: 'Solicitud eliminada', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = solicitudController;