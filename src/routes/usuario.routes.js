const express = require('express');
const router = express.Router();
// ¡ARREGLO! Faltaba importar el controlador
const UsuarioController = require('../controllers/usuario.controller'); 
const verifyToken = require('../middleware/auth.middleware');

// Ruta para obtener solo los veterinarios
// GET /api/usuarios/veterinarios
router.get(
  '/veterinarios',
  verifyToken, // ¡Ruta protegida!
  UsuarioController.getVeterinarios
);

module.exports = router;

