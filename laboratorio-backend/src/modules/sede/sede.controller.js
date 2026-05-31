// ─────────────────────────────────────────────────────────────
//  SEDE — CONTROLLER
// ─────────────────────────────────────────────────────────────
const sedeQueries = require('./sede.queries');
const { createError } = require('../../middlewares/errorHandler');

const sedeController = {

  // GET /api/v1/sedes
  getAll: async (req, res, next) => {
    try {
      const { rows } = await sedeQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  // GET /api/v1/sedes/:id
  getById: async (req, res, next) => {
    try {
      const sede = await sedeQueries.getById(req.params.id);
      if (!sede) throw createError('Sede no encontrada', 404);
      res.json({ ok: true, data: sede });
    } catch (err) { next(err); }
  },

  // POST /api/v1/sedes
  create: async (req, res, next) => {
    try {
      const sede = await sedeQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Sede creada', data: sede });
    } catch (err) { next(err); }
  },

  // PUT /api/v1/sedes/:id
  update: async (req, res, next) => {
    try {
      const sede = await sedeQueries.update(req.params.id, req.body);
      if (!sede) throw createError('Sede no encontrada', 404);
      res.json({ ok: true, message: 'Sede actualizada', data: sede });
    } catch (err) { next(err); }
  },

  // DELETE /api/v1/sedes/:id
  delete: async (req, res, next) => {
    try {
      const deleted = await sedeQueries.delete(req.params.id);
      if (!deleted) throw createError('Sede no encontrada', 404);
      res.json({ ok: true, message: 'Sede eliminada', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = sedeController;
