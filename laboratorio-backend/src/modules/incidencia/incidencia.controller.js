const incidenciaQueries = require('./incidencia.queries');
const { createError } = require('../../middlewares/errorHandler');

const incidenciaController = {

  getAll: async (req, res, next) => {
    try {
      const { rows } = await incidenciaQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const inc = await incidenciaQueries.getById(req.params.id);
      if (!inc) throw createError('Incidencia no encontrada', 404);
      res.json({ ok: true, data: inc });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const inc = await incidenciaQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Incidencia registrada', data: inc });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const inc = await incidenciaQueries.update(req.params.id, req.body);
      if (!inc) throw createError('Incidencia no encontrada', 404);
      res.json({ ok: true, message: 'Incidencia actualizada', data: inc });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await incidenciaQueries.delete(req.params.id);
      if (!deleted) throw createError('Incidencia no encontrada', 404);
      res.json({ ok: true, message: 'Incidencia eliminada', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = incidenciaController;