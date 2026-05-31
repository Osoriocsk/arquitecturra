// ─────────────────────────────────────────────────────────────
//  ROL — CONTROLLER
// ─────────────────────────────────────────────────────────────
const rolQueries = require('./rol.queries');
const { createError } = require('../../middlewares/errorHandler');

const rolController = {

  // GET /api/v1/roles
  getAll: async (req, res, next) => {
    try {
      const { rows } = await rolQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  // GET /api/v1/roles/:id
  getById: async (req, res, next) => {
    try {
      const rol = await rolQueries.getById(req.params.id);
      if (!rol) throw createError('Rol no encontrado', 404);
      res.json({ ok: true, data: rol });
    } catch (err) { next(err); }
  },

  // POST /api/v1/roles
  create: async (req, res, next) => {
    try {
      const rol = await rolQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Rol creado', data: rol });
    } catch (err) { next(err); }
  },

  // PUT /api/v1/roles/:id
  update: async (req, res, next) => {
    try {
      const rol = await rolQueries.update(req.params.id, req.body);
      if (!rol) throw createError('Rol no encontrado', 404);
      res.json({ ok: true, message: 'Rol actualizado', data: rol });
    } catch (err) { next(err); }
  },

  // DELETE /api/v1/roles/:id
  delete: async (req, res, next) => {
    try {
      const deleted = await rolQueries.delete(req.params.id);
      if (!deleted) throw createError('Rol no encontrado', 404);
      res.json({ ok: true, message: 'Rol eliminado', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = rolController;
