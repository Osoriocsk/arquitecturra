const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const router       = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// ─────────────────────────────────────────────────────────────
//  MIDDLEWARES GLOBALES
// ─────────────────────────────────────────────────────────────

// CORS — permite peticiones desde el frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parsear JSON en el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger de peticiones HTTP (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─────────────────────────────────────────────────────────────
//  RUTAS
//  Todas las rutas de la API viven bajo el prefijo /api/v1
// ─────────────────────────────────────────────────────────────
app.use('/api/v1', router);

// Ruta raíz informativa
app.get('/', (req, res) => {
  res.json({
    proyecto: 'Sistema de Gestión de Equipos de Laboratorio',
    version: '1.0.0',
    docs: '/api/v1/health',
  });
});

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// ─────────────────────────────────────────────────────────────
//  MANEJADOR GLOBAL DE ERRORES (siempre al final)
// ─────────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
