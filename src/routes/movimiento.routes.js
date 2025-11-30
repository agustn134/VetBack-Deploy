const express = require('express');
const router = express.Router();
const movimientoController = require('../controllers/movimiento.controller');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

router.use(verifyToken);

router.route('/')
  .get( checkRole(['Admin']),movimientoController.getAllMovimientos)
  .post( checkRole(['Admin']),movimientoController.createMovimiento);

module.exports = router;
