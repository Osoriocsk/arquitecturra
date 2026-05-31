// ─────────────────────────────────────────────────────────────
//  LABORATORIO — CONTROLLER
// ─────────────────────────────────────────────────────────────
const laboratorioQueries = require('./laboratorio.queries');
const { createError } = require('../../middlewares/errorHandler');

const laboratorioController = {

  getAll: async (req, res, next) => {
    try {
      const { rows } = await laboratorioQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const lab = await laboratorioQueries.getById(req.params.id);
      if (!lab) throw createError('Laboratorio no encontrado', 404);
      res.json({ ok: true, data: lab });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const lab = await laboratorioQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Laboratorio creado', data: lab });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const lab = await laboratorioQueries.update(req.params.id, req.body);
      if (!lab) throw createError('Laboratorio no encontrado', 404);
      res.json({ ok: true, message: 'Laboratorio actualizado', data: lab });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await laboratorioQueries.delete(req.params.id);
      if (!deleted) throw createError('Laboratorio no encontrado', 404);
      res.json({ ok: true, message: 'Laboratorio eliminado', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },

  getByResponsable: async (req, res, next) => {
    try {
      const { rows } = await laboratorioQueries.getByResponsable(req.params.usuario_id);
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },
};

module.exports = laboratorioController;