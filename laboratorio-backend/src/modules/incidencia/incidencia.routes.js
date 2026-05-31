const { Router } = require('express');
const controller = require('./incidencia.controller');
const { validate, validateId } = require('../../middlewares/validateRequest');

const router = Router();

router.get('/',       controller.getAll);
router.get('/:id',    validateId, controller.getById);
router.post('/',      validate(['descripcion', 'equipo_id', 'usuario_id']), controller.create);
router.put('/:id',    validateId, controller.update);
router.delete('/:id', validateId, controller.delete);

module.exports = router;