const { Router } = require('express');
const controller = require('./historial.controller');
const { validate, validateId } = require('../../middlewares/validateRequest');

const router = Router();

router.get('/',       controller.getAll);
router.get('/:id',    validateId, controller.getById);
router.post('/',      validate(['tipo_accion', 'equipo_id', 'usuario_id']), controller.create);
router.delete('/:id', validateId, controller.delete);

module.exports = router;