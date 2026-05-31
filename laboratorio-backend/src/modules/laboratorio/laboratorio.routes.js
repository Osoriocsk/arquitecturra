const { Router } = require('express');
const controller = require('./laboratorio.controller');
const { validate, validateId } = require('../../middlewares/validateRequest');

const router = Router();

router.get('/',                        controller.getAll);
router.get('/responsable/:usuario_id', controller.getByResponsable);
router.get('/:id',                     validateId, controller.getById);
router.post('/',                       validate(['nombre', 'sede_id']), controller.create);
router.put('/:id',                     validateId, controller.update);
router.delete('/:id',                  validateId, controller.delete);

module.exports = router;