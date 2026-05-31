const db = require('../../config/database');

const reportesQueries = {

  equiposDisponibles: () => db.query(`
    SELECT id, equipo, serial, marca, modelo, estado, categoria, laboratorio, sede
    FROM v_equipos_disponibles
    ORDER BY sede, laboratorio, equipo
  `),

  prestamosActivos: () => db.query(`
    SELECT id, fecha_entrega, fecha_dev_esperada, dias_restantes,
           estado, solicitante, tecnico, equipo, serial, laboratorio
    FROM v_prestamos_activos
    ORDER BY dias_restantes ASC
  `),

  solicitudesPendientes: () => db.query(`
    SELECT id, fecha_inicio, fecha_fin, observacion,
           fecha_creacion, solicitante, correo, total_equipos
    FROM v_solicitudes_pendientes
    ORDER BY fecha_creacion ASC
  `),
};

module.exports = reportesQueries;