// ─────────────────────────────────────────────────────────────
//  CATEGORIA — RUTAS
//  GET    /api/v1/categorias        → listar todas
//  GET    /api/v1/categorias/:id    → una por ID
//  POST   /api/v1/categorias        → crear
//  PUT    /api/v1/categorias/:id    → actualizar
//  DELETE /api/v1/categorias/:id    → eliminar
// ─────────────────────────────────────────────────────────────
const { Router } = require('express');
const controller = require('./categoria.controller');
const { validate, validateId } = require('../../middlewares/validateRequest');

const router = Router();

router.get('/',       controller.getAll);
router.get('/:id',    validateId, controller.getById);
router.post('/',      validate(['nombre']), controller.create);
router.put('/:id',    validateId, controller.update);
router.delete('/:id', validateId, controller.delete);

module.exports = router;
