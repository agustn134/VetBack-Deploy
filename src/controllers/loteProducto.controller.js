const LoteProductoModel = require('../models/loteProducto.model');
const responseHandler = require('../utils/responseHandler');

const LoteProductoController = {
    createLote: async (req, res) => {
        const { producto_id, num_lote, cantidad_inicial, fecha_caducidad, proveedor_id } = req.body;
                
        if (!producto_id || !num_lote || !cantidad_inicial || !fecha_caducidad) {
            return responseHandler.error(
                res,
                'Faltan campos obligatorios: producto_id, num_lote, cantidad_inicial, y fecha_caducidad.',
                400
            );
        }

        try {
            const nuevoLote = await LoteProductoModel.create(req.body);
            return responseHandler.success(
                res,
                nuevoLote,
                'Lote registrado como nueva llegada con éxito.',
                201
            );
        } catch (error) {
            let statusCode = 500;
            let message = 'Error interno del servidor al registrar el lote.';

            if (error.message.includes("Violación de clave foránea")) {
                statusCode = 404;
                message = error.message; 
            }
            
            return responseHandler.error(res, message, statusCode);
        }
    },

    getAllLotes: async (req, res) => {
        try {
            const lotes = await LoteProductoModel.findAll();
            return responseHandler.success(
                res,
                lotes,
                `Se encontraron ${lotes.length} lotes en el inventario.`
            );
        } catch (error) {
            return responseHandler.error(
                res,
                'Error interno del servidor al obtener la lista de lotes.'
            );
        }
    },

    getLotesByProductoId: async (req, res) => {
        const producto_id = parseInt(req.params.id); 
        
        try {
            const lotes = await LoteProductoModel.findByProductoId(producto_id);

            if (lotes.length === 0) {
                return responseHandler.success(
                    res,
                    [],
                    `No se encontraron lotes activos para el Producto ID ${producto_id}.`,
                    404
                );
            }
            
            return responseHandler.success(
                res,
                lotes,
                `Lotes activos para el Producto ID ${producto_id} encontrados con éxito.`
            );
        } catch (error) {
            return responseHandler.error(
                res,
                'Error interno del servidor al buscar lotes por ID de producto.'
            );
        }
    },
    
    updateLoteInventory: async (req, res) => {
        const lote_id = parseInt(req.params.id);
        const { cantidad_consumida } = req.body; 

        if (!cantidad_consumida || cantidad_consumida <= 0) {
            return responseHandler.error(
                res,
                'La cantidad consumida debe ser un número positivo mayor a cero.',
                400
            );
        }

        try {
            const loteActualizado = await LoteProductoModel.updateInventory(lote_id, cantidad_consumida);

            if (!loteActualizado) {
                return responseHandler.error(
                    res,
                    `El Lote ID ${lote_id} no existe o no tiene suficiente cantidad disponible (${cantidad_consumida}).`,
                    409
                );
            }
            
            return responseHandler.success(
                res,
                loteActualizado,
                `Inventario del lote actualizado. Nueva cantidad disponible: ${loteActualizado.cantidad_disponible}`
            );
        } catch (error) {
            return responseHandler.error(
                res,
                'Error interno del servidor al actualizar el inventario del lote.'
            );
        }
    },

    deleteLote: async (req, res) => {
        const id = parseInt(req.params.id);

        try {
            const loteEliminado = await LoteProductoModel.remove(id);

            if (!loteEliminado) {
                return responseHandler.error(
                    res,
                    `Lote con ID ${id} no encontrado.`,
                    404
                );
            }
            
            return responseHandler.success(
                res,
                loteEliminado,
                'Lote eliminado con éxito. Stock completamente removido.'
            );
        } catch (error) {
            return responseHandler.error(
                res,
                'Error interno del servidor al eliminar lote.'
            );
        }
    },

    getDetalleProductoYLote: async (req, res) => {
        const { id } = req.params;

        try {
            const detalles = await LoteProductoModel.getDetalleProductoYLote(id);

            if (!detalles || detalles.length === 0) {
            return responseHandler.error(res, 'No se encontraron detalles para este producto.', 404);
            }

            return responseHandler.success(res, detalles, 'Detalles obtenidos correctamente.');
        } catch (error) {
            return responseHandler.error(res, 'Error interno del servidor al obtener los detalles.', 500);
        }
    },
};

module.exports = LoteProductoController;