const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf.controller');

// GET /api/reportes/expediente/:id - Generar reporte médico completo
router.get('/expediente/:id', pdfController.generarReporteMedico);

// GET /api/reportes/certificado/:id - Generar certificado de salud
router.get('/certificado/:id', pdfController.generarCertificadoSalud);

// GET /api/reportes/descargar/:nombreArchivo - Descargar reporte generado
router.get('/descargar/:nombreArchivo', pdfController.descargarReporte);

module.exports = router;