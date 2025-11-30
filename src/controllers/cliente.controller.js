// /home/agus/Documentos/VetHealth/VetBack/src/controllers/cliente.controller.js

const ClienteModel = require('../models/cliente.model');
const responseHandler = require('../utils/responseHandler');

const ClienteController = {
    /**
     * GET /api/clientes/validar/:correo
     * RQF01 - Validar si un cliente existe y obtener sus mascotas
     */
    validarCliente: async (req, res) => {
        const { correo } = req.params;
        
        console.log(`[CONTROLADOR CLIENTE] Validando cliente: ${correo}`);
        
        try {
            const cliente = await ClienteModel.findByEmail(correo);
            
            if (cliente) {
                // Si el cliente existe, buscamos sus mascotas
                const mascotas = await ClienteModel.findMascotasByClienteId(cliente.id);
                
                console.log(`[CONTROLADOR CLIENTE] Cliente encontrado con ${mascotas.length} mascotas`);
                
                // RQF01 - SALIDA ESPERADA: Retorna los datos y mascotas del cliente.
                return responseHandler.success(res, {
                    existe: true,
                    cliente_id: cliente.id,
                    nombre: cliente.nombre_completo,
                    telefono: cliente.telefono,
                    correo: cliente.correo,
                    mascotas: mascotas
                }, 'Cliente encontrado.');
                
            } else {
                console.log('[CONTROLADOR CLIENTE] Cliente nuevo (no registrado)');
                
                // RQF01 - SALIDA ESPERADA: Indica que es un cliente nuevo.
                return responseHandler.success(res, {
                    existe: false
                }, 'Cliente nuevo.');
            }
            
        } catch (error) {
            console.error('[CONTROLADOR CLIENTE] Error al validar cliente:', error);
            return responseHandler.error(res, 'Error al validar cliente.', 500);
        }
    }
};

module.exports = ClienteController;