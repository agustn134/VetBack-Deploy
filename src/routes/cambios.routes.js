const express = require('express');
const router = express.Router();
const CambiosController = require('../controllers/cambios.controller');

router.get('/expediente/:expediente_id', CambiosController.obtenerPorExpediente);
router.get('/consulta/:consulta_id', CambiosController.obtenerPorConsulta);

module.exports = router;
