const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const authQueries = require('./auth.queries');
const { createError } = require('../../middlewares/errorHandler');

const authController = {

  // POST /api/v1/auth/login
  login: async (req, res, next) => {
    try {
      const { correo, contrasena } = req.body;

      const usuario = await authQueries.findByCorreo(correo);
      if (!usuario) throw createError('Credenciales inválidas', 401);

      if (usuario.estado !== 'activo') throw createError('Usuario inactivo', 403);

      const passwordOk = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!passwordOk) throw createError('Credenciales inválidas', 401);

      const token = jwt.sign(
        { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );

      res.json({
        ok: true,
        message: 'Login exitoso',
        token,
        usuario: {
          id:     usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol:    usuario.rol,
        },
      });
    } catch (err) { next(err); }
  },

  // GET /api/v1/auth/me
  me: async (req, res) => {
    res.json({ ok: true, data: req.usuario });
  },
};

module.exports = authController;