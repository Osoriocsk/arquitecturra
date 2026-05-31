const historialQueries = require('./historial.queries');
const { createError } = require('../../middlewares/errorHandler');

const historialController = {

  getAll: async (req, res, next) => {
    try {
      const { rows } = await historialQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const h = await historialQueries.getById(req.params.id);
      if (!h) throw createError('Registro no encontrado', 404);
      res.json({ ok: true, data: h });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const h = await historialQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Registro creado', data: h });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await historialQueries.delete(req.params.id);
      if (!deleted) throw createError('Registro no encontrado', 404);
      res.json({ ok: true, message: 'Registro eliminado', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = historialController;