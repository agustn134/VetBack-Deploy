const express = require('express');
const router = express.Router();
const expedienteController = require('../controllers/expediente.controller');
const verifyToken = require('../middleware/auth.middleware');

router.use(verifyToken);


// NUEVO: Obtener TODOS los expedientes de un paciente (con conteo de consultas)
router.get('/paciente/:paciente_id/todos', expedienteController.obtenerTodosExpedientesPorPaciente);

// NUEVO: Obtener expediente completo con todas sus relaciones
router.get('/:id/completo', expedienteController.obtenerExpedienteCompleto);

// Obtener detalle de expediente (más específico, va antes)
router.get('/:id/detalle', expedienteController.obtenerExpedienteDetalle);

// Obtener UN expediente por paciente (el más reciente)
router.get('/paciente/:paciente_id', expedienteController.obtenerPorPaciente);

// Crear expediente
router.post('/', expedienteController.crearExpediente);

// Listar expedientes
router.get('/', expedienteController.obtenerExpedientes);

// Buscar expedientes
router.get('/buscar', expedienteController.buscarExpedientes);

// Obtener expediente por ID (más genérico, va después)
router.get('/:id', expedienteController.obtenerExpedientePorId);

// Actualizar expediente (agregar PATCH además de PUT)
router.put('/:id', expedienteController.actualizarExpediente);
router.patch('/:id', expedienteController.actualizarExpediente);

// Eliminar expediente
router.delete('/:id', expedienteController.eliminarExpediente);

module.exports = router;