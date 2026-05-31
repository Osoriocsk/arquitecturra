const db = require('../../config/database');

const authQueries = {

  findByCorreo: (correo) => db.queryOne(`
    SELECT
      u.id, u.nombre, u.correo, u.contrasena, u.estado,
      r.nombre AS rol
    FROM usuario u
    JOIN rol r ON r.id = u.rol_id
    WHERE u.correo = $1
  `, [correo]),
};

module.exports = authQueries;