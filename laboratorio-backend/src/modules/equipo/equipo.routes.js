// ─────────────────────────────────────────────────────────────
//  EQUIPO — RUTAS
//  Monta los endpoints REST del módulo.
//
//  GET    /api/v1/equipos                → listar todos
//  GET    /api/v1/equipos/disponibles    → solo disponibles
//  GET    /api/v1/equipos/:id            → uno por ID
//  POST   /api/v1/equipos                → crear
//  PUT    /api/v1/equipos/:id            → actualizar completo
//  PATCH  /api/v1/equipos/:id/estado     → solo el estado
//  DELETE /api/v1/equipos/:id            → eliminar
// ─────────────────────────────────────────────────────────────
const { Router } = require('express');
const controller = require('./equipo.controller');
const { validate, validateId } = require('../../middlewares/validateRequest');

const router = Router();

const camposRequeridos = ['nombre', 'laboratorio_id', 'categoria_id'];

router.get('/',              controller.getAll);
router.get('/disponibles',   controller.getDisponibles);
router.get('/:id',           validateId, controller.getById);
router.post('/',             validate(camposRequeridos), controller.create);
router.put('/:id',           validateId, controller.update);
router.patch('/:id/estado',  validateId, validate(['estado']), controller.updateEstado);
router.delete('/:id',        validateId, controller.delete);

module.exports = router;
