// ─────────────────────────────────────────────────────────────
//  MANEJADOR GLOBAL DE ERRORES
//  Se registra al final de app.js con app.use(errorHandler)
// ─────────────────────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  // Mostrar el error completo solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', err);
  }

  // Error de validación de PostgreSQL (violación de constraint)
  if (err.code === '23505') {
    return res.status(409).json({
      ok: false,
      message: 'Ya existe un registro con ese valor único.',
      detail: err.detail,
    });
  }

  // Foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      ok: false,
      message: 'El registro referenciado no existe.',
      detail: err.detail,
    });
  }

  // Check constraint violation
  if (err.code === '23514') {
    return res.status(400).json({
      ok: false,
      message: 'Los datos no cumplen una regla de validación.',
      detail: err.detail,
    });
  }

  // Error personalizado con statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      ok: false,
      message: err.message,
    });
  }

  // Error genérico del servidor
  return res.status(500).json({
    ok: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor.'
      : err.message,
  });
};

// Helper para lanzar errores con código HTTP desde cualquier lugar
const createError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = { errorHandler, createError };
