const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

router.use(verifyToken);

router.route('/')
  .get(checkRole(['Admin', 'Veterinario', 'Recepcionista']), productoController.getAllProductos)
  .post(checkRole(['Admin']), productoController.createProducto);

router.route('/:id')
  .get(checkRole(['Admin','Recepcionista']), productoController.getProductoById)
  .patch(checkRole(['Admin']), productoController.updateProducto)
  .delete(checkRole(['Admin']), productoController.deleteProducto);

module.exports = router;
