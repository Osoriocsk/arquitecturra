const prestamoQueries = require('./prestamo.queries');
const { createError } = require('../../middlewares/errorHandler');

const prestamoController = {

  getAll: async (req, res, next) => {
    try {
      const { rows } = await prestamoQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const prestamo = await prestamoQueries.getById(req.params.id);
      if (!prestamo) throw createError('Préstamo no encontrado', 404);
      res.json({ ok: true, data: prestamo });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const prestamo = await prestamoQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Préstamo creado', data: prestamo });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const prestamo = await prestamoQueries.update(req.params.id, req.body);
      if (!prestamo) throw createError('Préstamo no encontrado', 404);
      res.json({ ok: true, message: 'Préstamo actualizado', data: prestamo });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await prestamoQueries.delete(req.params.id);
      if (!deleted) throw createError('Préstamo no encontrado', 404);
      res.json({ ok: true, message: 'Préstamo eliminado', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = prestamoController;