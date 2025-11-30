// src/routes/paciente.routes.js
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/paciente.controller');
const verifyToken = require('../middleware/auth.middleware');

router.use(verifyToken);

// Crear paciente
router.post('/', pacienteController.crearPaciente);

// Listar pacientes
router.get('/', pacienteController.obtenerPacientes);

// Obtener paciente por ID
router.get('/:id', pacienteController.obtenerPacientePorId);

// Actualizar paciente
router.put('/:id', pacienteController.actualizarPaciente);

// Eliminar paciente
router.delete('/:id', pacienteController.eliminarPaciente);

module.exports = router;
