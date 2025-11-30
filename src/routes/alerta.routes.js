// src/routes/alerta.routes.js
const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alerta.controller');

// 1. Importación CORRECTA de verifyToken (es la exportación principal del archivo)
const verifyToken = require('../middleware/auth.middleware'); 

// 2. Importación CORRECTA de la función fábrica de roles
const checkRole = require('../middleware/role.middleware'); 

// 3. Creación del middleware 'isAdmin' invocando la función fábrica.
//    Esto convierte checkRole en una función (req, res, next) real.
const isAdmin = checkRole(['Admin']); 


// Ruta protegida para obtener todos los datos del dashboard de administrador
router.get(
    '/dashboard-data', 
    verifyToken, // Esto es una función (req, res, next)
    isAdmin,     // Esto es una función (req, res, next)
    alertaController.getAlertasDashboard // Esto es una función controladora
);

module.exports = router;