// ─────────────────────────────────────────────────────────────
//  MIDDLEWARE DE VALIDACIÓN DE PARÁMETROS
//  Uso: en cualquier ruta, antes del controller
//
//  Ejemplo:
//    router.post('/', validate(['nombre', 'correo']), controller.crear)
// ─────────────────────────────────────────────────────────────

/**
 * Verifica que los campos requeridos estén presentes en req.body.
 * @param {string[]} fields - Nombres de los campos obligatorios
 */
const validate = (fields = []) => (req, res, next) => {
  const missing = fields.filter(
    (field) => req.body[field] === undefined || req.body[field] === ''
  );

  if (missing.length > 0) {
    return res.status(400).json({
      ok: false,
      message: `Campos requeridos faltantes: ${missing.join(', ')}`,
    });
  }

  next();
};

/**
 * Verifica que el parámetro :id de la URL sea un número entero válido.
 */
const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      ok: false,
      message: 'El ID proporcionado no es válido.',
    });
  }
  req.params.id = id;
  next();
};

module.exports = { validate, validateId };
