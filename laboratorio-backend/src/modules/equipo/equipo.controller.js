// ─────────────────────────────────────────────────────────────
//  EQUIPO — CONTROLLER
//  Recibe la petición HTTP, llama al query correspondiente
//  y devuelve la respuesta JSON. Sin SQL aquí.
// ─────────────────────────────────────────────────────────────
const equipoQueries = require('./equipo.queries');
const { createError } = require('../../middlewares/errorHandler');

const equipoController = {

  // GET /api/v1/equipos
  getAll: async (req, res, next) => {
    try {
      const { rows } = await equipoQueries.getAll();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/equipos/disponibles
  getDisponibles: async (req, res, next) => {
    try {
      const { rows } = await equipoQueries.getDisponibles();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/equipos/:id
  getById: async (req, res, next) => {
    try {
      const equipo = await equipoQueries.getById(req.params.id);
      if (!equipo) throw createError('Equipo no encontrado', 404);
      res.json({ ok: true, data: equipo });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/equipos
  create: async (req, res, next) => {
    try {
      const equipo = await equipoQueries.create(req.body);
      res.status(201).json({ ok: true, message: 'Equipo creado', data: equipo });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/v1/equipos/:id
  update: async (req, res, next) => {
    try {
      const equipo = await equipoQueries.update(req.params.id, req.body);
      if (!equipo) throw createError('Equipo no encontrado', 404);
      res.json({ ok: true, message: 'Equipo actualizado', data: equipo });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/v1/equipos/:id/estado
  updateEstado: async (req, res, next) => {
    try {
      const { estado } = req.body;
      const estadosValidos = ['disponible','reservado','prestado','en_mantenimiento','dado_de_baja'];
      if (!estadosValidos.includes(estado)) {
        throw createError(`Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`, 400);
      }
      const equipo = await equipoQueries.updateEstado(req.params.id, estado);
      if (!equipo) throw createError('Equipo no encontrado', 404);
      res.json({ ok: true, message: 'Estado actualizado', data: equipo });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/v1/equipos/:id
  delete: async (req, res, next) => {
    try {
      const deleted = await equipoQueries.delete(req.params.id);
      if (!deleted) throw createError('Equipo no encontrado', 404);
      res.json({ ok: true, message: 'Equipo eliminado', data: { id: deleted.id } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = equipoController;
