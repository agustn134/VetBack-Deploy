const express = require('express');
const router = express.Router();
const procedimientoController = require('../controllers/procedimiento.controller');
const verificarToken  = require('../middleware/auth.middleware');

router.use(verificarToken);

router.patch('/', procedimientoController.upsertProcedimientos);

router.get('/:id', procedimientoController.obtenerProcedimiento);

router.get('/consulta/:consulta_id', procedimientoController.obtenerPorConsulta);

router.delete('/:id', procedimientoController.eliminarProcedimiento);

module.exports = router;