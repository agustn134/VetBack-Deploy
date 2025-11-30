const PDFService = require('../services/pdfService');
const ExpedienteModel = require('../models/expediente.model');
const responseHandler = require('../utils/responseHandler');
const path = require('path');
const fs = require('fs');

const PDFController = {

    // ============================================
    // RQF02 - GENERAR REPORTE MÉDICO COMPLETO
    // GET /api/reportes/expediente/:id
    // ============================================
    generarReporteMedico: async (req, res) => {
        const { id } = req.params;

        console.log(`[CONTROLADOR PDF] Generando reporte médico del expediente ID: ${id}`);

        try {
            // Obtener datos del expediente
            const expediente = await ExpedienteModel.findById(id);

            if (!expediente) {
                return responseHandler.error(res, 'Expediente no encontrado.', 404);
            }

            // Obtener historial completo
            const consultas = await ExpedienteModel.getHistorialCompleto(id);

            // Generar PDF
            const resultado = await PDFService.generarReporteMedico(expediente, consultas);

            console.log('[CONTROLADOR PDF] Reporte generado exitosamente');

            return responseHandler.success(
                res,
                resultado,
                'Reporte médico generado exitosamente.'
            );

        } catch (error) {
            console.error('[CONTROLADOR PDF] Error al generar reporte:', error.message);
            return responseHandler.error(
                res,
                `Error al generar reporte: ${error.message}`,
                500
            );
        }
    },

    // ============================================
    // RQF02 - GENERAR CERTIFICADO DE SALUD
    // GET /api/reportes/certificado/:id
    // ============================================
    generarCertificadoSalud: async (req, res) => {
        const { id } = req.params;

        console.log(`[CONTROLADOR PDF] Generando certificado de salud del expediente ID: ${id}`);

        try {
            // Obtener datos del expediente
            const expediente = await ExpedienteModel.findById(id);

            if (!expediente) {
                return responseHandler.error(res, 'Expediente no encontrado.', 404);
            }

            // Obtener última consulta
            const consultas = await ExpedienteModel.getHistorialCompleto(id);
            const ultimaConsulta = consultas.length > 0 ? consultas[0] : null;

            if (!ultimaConsulta) {
                return responseHandler.error(
                    res,
                    'No hay consultas registradas para generar el certificado.',
                    400
                );
            }

            // Generar certificado
            const resultado = await PDFService.generarCertificadoSalud(expediente, ultimaConsulta);

            console.log('[CONTROLADOR PDF] Certificado generado exitosamente');

            return responseHandler.success(
                res,
                resultado,
                'Certificado de salud generado exitosamente.'
            );

        } catch (error) {
            console.error('[CONTROLADOR PDF] Error al generar certificado:', error.message);
            return responseHandler.error(
                res,
                `Error al generar certificado: ${error.message}`,
                500
            );
        }
    },

    // ============================================
    // RQF02 - DESCARGAR REPORTE PDF
    // GET /api/reportes/descargar/:nombreArchivo
    // ============================================
    descargarReporte: async (req, res) => {
        const { nombreArchivo } = req.params;

        console.log(`[CONTROLADOR PDF] Descargando reporte: ${nombreArchivo}`);

        try {
            const rutaArchivo = path.join(__dirname, '../../reportes', nombreArchivo);

            // Verificar que el archivo existe
            if (!fs.existsSync(rutaArchivo)) {
                return responseHandler.error(res, 'Reporte no encontrado.', 404);
            }

            // Descargar archivo
            res.download(rutaArchivo, nombreArchivo, (error) => {
                if (error) {
                    console.error('[CONTROLADOR PDF] Error al descargar:', error);
                    return responseHandler.error(
                        res,
                        'Error al descargar el reporte.',
                        500
                    );
                }

                console.log('[CONTROLADOR PDF] Reporte descargado exitosamente');
            });

        } catch (error) {
            console.error('[CONTROLADOR PDF] Error al descargar reporte:', error.message);
            return responseHandler.error(
                res,
                `Error al descargar reporte: ${error.message}`,
                500
            );
        }
    }
};

module.exports = PDFController;