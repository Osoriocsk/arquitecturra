// ─────────────────────────────────────────────────────────────
//  USUARIO — CONTROLLER
// ─────────────────────────────────────────────────────────────
const usuarioQueries = require('./usuario.queries');
const { createError } = require('../../middlewares/errorHandler');

const usuarioController = {

  getAll: async (req, res, next) => {
    try {
      const { rows } = await usuarioQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const usuario = await usuarioQueries.getById(req.params.id);
      if (!usuario) throw createError('Usuario no encontrado', 404);
      res.json({ ok: true, data: usuario });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const usuario = await usuarioQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Usuario creado', data: usuario });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const usuario = await usuarioQueries.update(req.params.id, req.body);
      if (!usuario) throw createError('Usuario no encontrado', 404);
      res.json({ ok: true, message: 'Usuario actualizado', data: usuario });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await usuarioQueries.delete(req.params.id);
      if (!deleted) throw createError('Usuario no encontrado', 404);
      res.json({ ok: true, message: 'Usuario eliminado', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = usuarioController;