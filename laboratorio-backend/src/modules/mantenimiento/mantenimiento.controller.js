const mantenimientoQueries = require('./mantenimiento.queries');
const { createError } = require('../../middlewares/errorHandler');

const mantenimientoController = {

  getAll: async (req, res, next) => {
    try {
      const { rows } = await mantenimientoQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const m = await mantenimientoQueries.getById(req.params.id);
      if (!m) throw createError('Mantenimiento no encontrado', 404);
      res.json({ ok: true, data: m });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const m = await mantenimientoQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Mantenimiento creado', data: m });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const m = await mantenimientoQueries.update(req.params.id, req.body);
      if (!m) throw createError('Mantenimiento no encontrado', 404);
      res.json({ ok: true, message: 'Mantenimiento actualizado', data: m });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await mantenimientoQueries.delete(req.params.id);
      if (!deleted) throw createError('Mantenimiento no encontrado', 404);
      res.json({ ok: true, message: 'Mantenimiento eliminado', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = mantenimientoController;