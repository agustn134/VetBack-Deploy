const express = require('express');
const router = express.Router();
const ProveedorController = require('../controllers/proveedor.controller');
const verifyToken = require('../middleware/auth.middleware'); 
const checkRole = require('../middleware/role.middleware'); 

router.use(verifyToken);

router.get('/', ProveedorController.getAll);

router.post('/',checkRole('Admin'), ProveedorController.create);

module.exports = router;
