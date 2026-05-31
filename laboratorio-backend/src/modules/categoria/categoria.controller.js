// ─────────────────────────────────────────────────────────────
//  CATEGORIA — CONTROLLER
// ─────────────────────────────────────────────────────────────
const categoriaQueries = require('./categoria.queries');
const { createError } = require('../../middlewares/errorHandler');

const categoriaController = {

  // GET /api/v1/categorias
  getAll: async (req, res, next) => {
    try {
      const { rows } = await categoriaQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  // GET /api/v1/categorias/:id
  getById: async (req, res, next) => {
    try {
      const categoria = await categoriaQueries.getById(req.params.id);
      if (!categoria) throw createError('Categoría no encontrada', 404);
      res.json({ ok: true, data: categoria });
    } catch (err) { next(err); }
  },

  // POST /api/v1/categorias
  create: async (req, res, next) => {
    try {
      const categoria = await categoriaQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Categoría creada', data: categoria });
    } catch (err) { next(err); }
  },

  // PUT /api/v1/categorias/:id
  update: async (req, res, next) => {
    try {
      const categoria = await categoriaQueries.update(req.params.id, req.body);
      if (!categoria) throw createError('Categoría no encontrada', 404);
      res.json({ ok: true, message: 'Categoría actualizada', data: categoria });
    } catch (err) { next(err); }
  },

  // DELETE /api/v1/categorias/:id
  delete: async (req, res, next) => {
    try {
      const deleted = await categoriaQueries.delete(req.params.id);
      if (!deleted) throw createError('Categoría no encontrada', 404);
      res.json({ ok: true, message: 'Categoría eliminada', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = categoriaController;
