const express = require('express');
const router = express.Router();
const imagenController = require('../controllers/imagen.controller');
const verificarToken  = require('../middleware/auth.middleware');

router.use(verificarToken);

const noCacheMiddleware = (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });
  next();
};

router.get('/consulta/:consulta_id', noCacheMiddleware, imagenController.obtenerPorConsulta);

router.post('/', imagenController.subirImagen);

router.get('/:id', imagenController.obtenerImagen);

router.patch('/:id', imagenController.actualizarImagen);

router.delete('/:id', imagenController.eliminarImagen);

module.exports = router;