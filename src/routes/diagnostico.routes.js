const express = require('express');
const router = express.Router();
const diagnosticoController = require('../controllers/diagnostico.controller');
const verificarToken  = require('../middleware/auth.middleware');

router.use(verificarToken);

router.patch('/', diagnosticoController.upsertDiagnosticos);
router.get('/:id', diagnosticoController.obtenerDiagnostico);
router.get('/consulta/:consulta_id', diagnosticoController.obtenerPorConsulta);
router.delete('/:id', diagnosticoController.eliminarDiagnostico);

module.exports = router;