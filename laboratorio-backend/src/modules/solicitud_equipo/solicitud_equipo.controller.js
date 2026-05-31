const solicitudEquipoQueries = require('./solicitud_equipo.queries');
const { createError } = require('../../middlewares/errorHandler');

const solicitudEquipoController = {

  getAll: async (req, res, next) => {
    try {
      const { rows } = await solicitudEquipoQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const se = await solicitudEquipoQueries.getById(req.params.id);
      if (!se) throw createError('Registro no encontrado', 404);
      res.json({ ok: true, data: se });
    } catch (err) { next(err); }
  },

  getBySolicitud: async (req, res, next) => {
    try {
      const { rows } = await solicitudEquipoQueries.getBySolicitud(req.params.solicitud_id);
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const se = await solicitudEquipoQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Equipo agregado a la solicitud', data: se });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const se = await solicitudEquipoQueries.update(req.params.id, req.body);
      if (!se) throw createError('Registro no encontrado', 404);
      res.json({ ok: true, message: 'Cantidad actualizada', data: se });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await solicitudEquipoQueries.delete(req.params.id);
      if (!deleted) throw createError('Registro no encontrado', 404);
      res.json({ ok: true, message: 'Equipo removido de la solicitud', data: { id: deleted.id } });
    } catch (err) { next(err); }
  },
};

module.exports = solicitudEquipoController;