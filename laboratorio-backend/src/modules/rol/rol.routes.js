// ─────────────────────────────────────────────────────────────
//  ROL — RUTAS
//  GET    /api/v1/roles        → listar todos
//  GET    /api/v1/roles/:id    → uno por ID
//  POST   /api/v1/roles        → crear
//  PUT    /api/v1/roles/:id    → actualizar
//  DELETE /api/v1/roles/:id    → eliminar
// ─────────────────────────────────────────────────────────────
const { Router } = require('express');
const controller = require('./rol.controller');
const { validate, validateId } = require('../../middlewares/validateRequest');

const router = Router();

router.get('/',       controller.getAll);
router.get('/:id',    validateId, controller.getById);
router.post('/',      validate(['nombre']), controller.create);
router.put('/:id',    validateId, controller.update);
router.delete('/:id', validateId, controller.delete);

module.exports = router;
