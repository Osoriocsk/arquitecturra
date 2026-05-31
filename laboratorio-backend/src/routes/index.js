const { Router } = require('express');
const router = Router();


// ─────────────────────────────────────────────────────────────
//  ROUTER PRINCIPAL
//  Aquí se registran todas las rutas de los módulos.
//  Cada módulo tiene su propio archivo de rutas.
// ─────────────────────────────────────────────────────────────

// Health check — verifica que el servidor está activo
router.get('/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Servidor activo',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── Módulos (se irán descomentando a medida que se desarrollen) ──
router.use('/roles',          require('../modules/rol/rol.routes'));
router.use('/usuarios',       require('../modules/usuario/usuario.routes'));
router.use('/sedes',          require('../modules/sede/sede.routes'));
router.use('/laboratorios',   require('../modules/laboratorio/laboratorio.routes'));
router.use('/categorias',     require('../modules/categoria/categoria.routes'));
router.use('/equipos',        require('../modules/equipo/equipo.routes'));
router.use('/solicitudes',    require('../modules/solicitud/solicitud.routes'));
router.use('/prestamos',      require('../modules/prestamo/prestamo.routes'));
router.use('/devoluciones',   require('../modules/devolucion/devolucion.routes'));
router.use('/mantenimientos', require('../modules/mantenimiento/mantenimiento.routes'));
router.use('/incidencias',    require('../modules/incidencia/incidencia.routes'));
router.use('/historial',      require('../modules/historial/historial.routes'));
router.use('/reservas',          require('../modules/reserva/reserva.routes'));
router.use('/solicitud-equipos', require('../modules/solicitud_equipo/solicitud_equipo.routes'));
router.use('/documentos-equipo', require('../modules/documento_equipo/documento_equipo.routes'));
router.use('/reportes', require('../modules/reportes/reportes.routes'));
router.use('/auth', require('../modules/auth/auth.routes'));


module.exports = router;
