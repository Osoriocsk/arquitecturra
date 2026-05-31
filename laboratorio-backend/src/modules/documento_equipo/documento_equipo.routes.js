const { Router } = require('express');
const controller = require('./documento_equipo.controller');
const { validate, validateId } = require('../../middlewares/validateRequest');

const router = Router();

router.get('/',                          controller.getAll);
router.get('/:id',       validateId,     controller.getById);
router.get('/equipo/:equipo_id',         controller.getByEquipo);
router.post('/',         validate(['nombre', 'tipo', 'ruta', 'equipo_id', 'usuario_id']), controller.create);
router.put('/:id',       validateId,     controller.update);
router.delete('/:id',    validateId,     controller.delete);

module.exports = router;