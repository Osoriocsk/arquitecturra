const { Router } = require('express');
const controller = require('./reportes.controller');

const router = Router();

router.get('/equipos-disponibles',    controller.equiposDisponibles);
router.get('/prestamos-activos',      controller.prestamosActivos);
router.get('/solicitudes-pendientes', controller.solicitudesPendientes);

module.exports = router;