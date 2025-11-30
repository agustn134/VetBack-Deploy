const express = require('express');
const router = express.Router();
const vacunaController = require('../controllers/vacuna.controller');
const verificarToken  = require('../middleware/auth.middleware');

router.use(verificarToken);

router.patch('/', vacunaController.upsertVacunas);

router.get('/:id', vacunaController.obtenerVacuna);

router.get('/consulta/:consulta_id', vacunaController.obtenerPorConsulta);

router.delete('/:id', vacunaController.eliminarVacuna);

module.exports = router;