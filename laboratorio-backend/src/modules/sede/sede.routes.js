// ─────────────────────────────────────────────────────────────
//  SEDE — RUTAS
//  GET    /api/v1/sedes        → listar todas
//  GET    /api/v1/sedes/:id    → una por ID
//  POST   /api/v1/sedes        → crear
//  PUT    /api/v1/sedes/:id    → actualizar
//  DELETE /api/v1/sedes/:id    → eliminar
// ─────────────────────────────────────────────────────────────
const { Router } = require('express');
const controller = require('./sede.controller');
const { validate, validateId } = require('../../middlewares/validateRequest');

const router = Router();

router.get('/',     controller.getAll);
router.get('/:id',  validateId, controller.getById);
router.post('/',    validate(['nombre']), controller.create);
router.put('/:id',  validateId, controller.update);
router.delete('/:id', validateId, controller.delete);

module.exports = router;
