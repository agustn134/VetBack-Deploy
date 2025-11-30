const express = require('express');
const router = express.Router();
const ConsultaController = require('../controllers/consulta.controller');

router.post('/', ConsultaController.crearConsulta);
router.get('/:id', ConsultaController.obtenerConsulta);
router.get('/expediente/:expediente_id', ConsultaController.obtenerPorExpediente);
router.patch('/:id', ConsultaController.actualizarConsulta);
router.delete('/:id', ConsultaController.eliminarConsulta);

module.exports = router;
