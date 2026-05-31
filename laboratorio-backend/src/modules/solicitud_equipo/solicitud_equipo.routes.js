const { Router } = require('express');
const controller = require('./solicitud_equipo.controller');
const { validate, validateId } = require('../../middlewares/validateRequest');

const router = Router();

router.get('/',                              controller.getAll);
router.get('/:id',          validateId,      controller.getById);
router.get('/solicitud/:solicitud_id',       controller.getBySolicitud);
router.post('/',            validate(['solicitud_id', 'equipo_id', 'cantidad']), controller.create);
router.put('/:id',          validateId,      controller.update);
router.delete('/:id',       validateId,      controller.delete);

module.exports = router;