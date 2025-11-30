const express = require('express');
const router = express.Router();
const citaController = require('../controllers/cita.controller');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// RQF01 - Rutas RESTful para Citas
router.route('/')
    .get(citaController.getAllCitas)
    .post(citaController.createCita);

router.route('/:id')
    .put(citaController.updateCita)
    .delete(citaController.deleteCita);
    
// Ruta pública para confirmar citas por correo
router.get('/confirmar/:token', citaController.confirmarCita);

// Ruta para ver citas asignadas
router.get('/personal/:id', verifyToken, citaController.getCitasByVeterinario);

// Ruta para checklist de servicios
router.put('/:idCita/servicios/:idServicio', verifyToken, citaController.actualizarEstadoServicio);

// --- APLICAR SEGURIDAD GLOBAL ---
router.use(verifyToken);

router.get('/veterinario/:id', checkRole(['Veterinario']), citaController.getCitasByVeterinario);


// --- ¡AQUÍ ESTABA FALTANDO ESTA LÍNEA! ---
// Ruta para finalizar la cita completa (Botón grande)
router.put('/:id/completar', citaController.completarCita); 
// -----------------------------------------


module.exports = router;