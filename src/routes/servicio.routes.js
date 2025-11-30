const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicio.controller');

// Importamos sin llaves (tu middleware exporta la función directa)
const protect = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// Rutas Públicas
router.get('/', servicioController.getServicios);
router.get('/:id', servicioController.getServicioById);

// Rutas Privadas (Solo Admin)
// CORRECCIÓN: Usamos 'Admin' con mayúscula para coincidir con tu base de datos
router.post('/', protect, checkRole(['Admin']), servicioController.createServicio);
router.put('/:id', protect, checkRole(['Admin']), servicioController.updateServicio);
router.delete('/:id', protect, checkRole(['Admin']), servicioController.deleteServicio);

module.exports = router;