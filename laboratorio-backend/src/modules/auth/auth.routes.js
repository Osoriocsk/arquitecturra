const { Router } = require('express');
const controller  = require('./auth.controller');
const { validate } = require('../../middlewares/validateRequest');
const authenticate = require('../../middlewares/authenticate');

const router = Router();

router.post('/login', validate(['correo', 'contrasena']), controller.login);
router.get('/me',     authenticate, controller.me);

module.exports = router;