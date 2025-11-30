const express = require('express');
const router = express.Router();
const loteProductoController = require('../controllers/loteProducto.controller');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

router.use(verifyToken);

router.get(
  '/detalle/:id',
  checkRole(['Admin', 'Veterinario', 'Recepcionista']),
  loteProductoController.getDetalleProductoYLote
);

router.route('/')
  .get(checkRole(['Admin', 'Veterinario', 'Recepcionista']), loteProductoController.getAllLotes)

  .post(checkRole(['Admin']), loteProductoController.createLote);

router.route('/:id')
  .put(checkRole(['Admin']), loteProductoController.updateLoteInventory)
  .delete(checkRole(['Admin']), loteProductoController.deleteLote);

module.exports = router;
