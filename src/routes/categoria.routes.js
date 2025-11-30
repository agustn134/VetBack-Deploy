const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

router.use(verifyToken);

router.route('/')
  .get(checkRole(['Admin']),categoriaController.getAllCategorias)
  .post(checkRole(['Admin']),categoriaController.createCategoria); 

router.route('/:id')
  .get(checkRole(['Admin']),categoriaController.getCategoriaById);

module.exports = router;
