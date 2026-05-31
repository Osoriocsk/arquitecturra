const documentoEquipoQueries = require('./documento_equipo.queries');
const { createError } = require('../../middlewares/errorHandler');

const documentoEquipoController = {

  getAll: async (req, res, next) => {
    try {
      const { rows } = await documentoEquipoQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const doc = await documentoEquipoQueries.getById(req.params.id);
      if (!doc) throw createError('Documento no encontrado', 404);
      res.json({ ok: true, data: doc });
    } catch (err) { next(err); }
  },

  getByEquipo: async (req, res, next) => {
    try {
      const { rows } = await documentoEquipoQueries.getByEquipo(req.params.equipo_id);
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const doc = await documentoEquipoQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Documento registrado', data: doc });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const doc = await documentoEquipoQueries.update(req.params.id, req.body);
      if (!doc) throw createError('Documento no encontrado', 404);
      res.json({ ok: true, message: 'Documento actualizado', data: doc });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await documentoEquipoQueries.delete(req.params.id);
      if (!deleted) throw createError('Documento no encontrado', 404);
      res.json({ ok: true, message: 'Documento eliminado', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = documentoEquipoController;