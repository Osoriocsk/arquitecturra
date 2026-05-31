const jwt = require('jsonwebtoken');
const { createError } = require('./errorHandler');

// ─────────────────────────────────────────────────────────────
//  MIDDLEWARE — Verifica el token JWT en cada petición
//  Uso: router.get('/ruta', authenticate, controller.metodo)
// ─────────────────────────────────────────────────────────────
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return next(createError('Token requerido', 401));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, nombre, rol }
    next();
  } catch (err) {
    next(createError('Token inválido o expirado', 401));
  }
};

module.exports = authenticate;