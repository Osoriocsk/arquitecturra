// ─────────────────────────────────────────────────────────────
//  USUARIO — RUTAS
//  GET    /api/v1/usuarios        → listar todos
//  GET    /api/v1/usuarios/:id    → uno por ID
//  POST   /api/v1/usuarios        → crear
//  PUT    /api/v1/usuarios/:id    → actualizar
//  DELETE /api/v1/usuarios/:id    → eliminar
// ─────────────────────────────────────────────────────────────
const { Router } = require('express');
const controller = require('./usuario.controller');
const { validate, validateId } = require('../../middlewares/validateRequest');

const router = Router();

router.get('/',       controller.getAll);
router.get('/:id',    validateId, controller.getById);
router.post('/',      validate(['nombre', 'correo', 'contrasena', 'rol_id']), controller.create);
router.put('/:id',    validateId, controller.update);
router.delete('/:id', validateId, controller.delete);

module.exports = router;