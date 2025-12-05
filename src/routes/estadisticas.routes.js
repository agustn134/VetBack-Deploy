const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticas.controller');

router.get('/dashboard', estadisticasController.getDashboardData);

module.exports = router;