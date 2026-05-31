const reportesQueries = require('./reportes.queries');

const reportesController = {

  // GET /api/v1/reportes/equipos-disponibles
  equiposDisponibles: async (req, res, next) => {
    try {
      const { rows } = await reportesQueries.equiposDisponibles();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  // GET /api/v1/reportes/prestamos-activos
  prestamosActivos: async (req, res, next) => {
    try {
      const { rows } = await reportesQueries.prestamosActivos();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },

  // GET /api/v1/reportes/solicitudes-pendientes
  solicitudesPendientes: async (req, res, next) => {
    try {
      const { rows } = await reportesQueries.solicitudesPendientes();
      res.json({ ok: true, total: rows.length, data: rows });
    } catch (err) { next(err); }
  },
};

module.exports = reportesController;