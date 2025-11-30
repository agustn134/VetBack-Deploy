const express = require('express');
const router = express.Router();
const tratamientoController = require('../controllers/tratamiento.controller');
const verificarToken  = require('../middleware/auth.middleware');

router.use(verificarToken);

router.patch('/', tratamientoController.upsertTratamientos);

router.get('/:id', tratamientoController.obtenerTratamiento);

router.get('/consulta/:consulta_id', tratamientoController.obtenerPorConsulta);

router.delete('/:id', tratamientoController.eliminarTratamiento);

module.exports = router;