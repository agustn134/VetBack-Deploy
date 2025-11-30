// /home/agus/Documentos/VetHealth/VetBack/src/routes/cliente.routes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

// GET /api/clientes/validar/:correo - RQF01 Validar Cliente
router.get('/validar/:correo', clienteController.validarCliente); 

module.exports = router;