const { Router } = require('express');
const controller = require('./mantenimiento.controller');
const { validate, validateId } = require('../../middlewares/validateRequest');

const router = Router();

router.get('/',       controller.getAll);
router.get('/:id',    validateId, controller.getById);
router.post('/',      validate(['tipo', 'equipo_id', 'tecnico_id', 'fecha_inicio']), controller.create);
router.put('/:id',    validateId, controller.update);
router.delete('/:id', validateId, controller.delete);

module.exports = router;