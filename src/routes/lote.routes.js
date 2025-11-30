const express = require('express');
const router = express.Router();
const loteController = require('../controllers/lote.controller');
const LoteProductoController = require('../controllers/loteProducto.controller');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

router.use(verifyToken);

router.post('/', checkRole(['Admin']), loteController.createLote);
router.get('/', checkRole(['Admin']),loteController.getAllLotes);
router.get('/:id', checkRole(['Admin']),LoteProductoController.getLotesByProductoId);

router.get('/detalle/:id', checkRole(['Admin']),LoteProductoController.getDetalleProductoYLote);

router.patch('/:id', checkRole(['Admin']), loteController.updateLote);
router.delete('/:id', checkRole(['Admin']), loteController.deleteLote);
// router.delete('/:id', checkRole(['Admin']),LoteProductoController.deleteLote);
module.exports = router;
