const reservaQueries = require('./reserva.queries');
const { createError } = require('../../middlewares/errorHandler');

const reservaController = {

  getAll: async (req, res, next) => {
    try {
      const { rows } = await reservaQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const r = await reservaQueries.getById(req.params.id);
      if (!r) throw createError('Reserva no encontrada', 404);
      res.json({ ok: true, data: r });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const r = await reservaQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Reserva creada', data: r });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const r = await reservaQueries.update(req.params.id, req.body);
      if (!r) throw createError('Reserva no encontrada', 404);
      res.json({ ok: true, message: 'Reserva actualizada', data: r });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await reservaQueries.delete(req.params.id);
      if (!deleted) throw createError('Reserva no encontrada', 404);
      res.json({ ok: true, message: 'Reserva eliminada', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = reservaController;