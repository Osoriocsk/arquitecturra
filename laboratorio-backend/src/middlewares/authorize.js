const { createError } = require('./errorHandler');

// ─────────────────────────────────────────────────────────────
//  MIDDLEWARE — Verifica que el usuario tenga el rol requerido
//  Uso: router.delete('/ruta', authenticate, authorize('Administrador'), controller.delete)
// ─────────────────────────────────────────────────────────────
const authorize = (...rolesPermitidos) => (req, res, next) => {
  if (!rolesPermitidos.includes(req.usuario.rol)) {
    return next(createError('No tienes permiso para esta acción', 403));
  }
  next();
};

module.exports = authorize;