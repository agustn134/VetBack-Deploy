const ProductoModel = require('../models/producto.model');
const responseHandler = require('../utils/responseHandler');

const ProductoController = {
    createProducto: async (req, res) => {
        const { nombre, descripcion, precio_venta, unidad_medida, categoria_id  } = req.body;

        if (!nombre || !precio_venta) {
            return responseHandler.error(
            res,
            'Nombre y precio de venta son campos obligatorios.',
            400
            );
        }

        try {
            const nuevoProducto = await ProductoModel.create({
            nombre,
            descripcion,
            precio_venta,
            unidad_medida,
            categoria_id 
            });

            return responseHandler.success(
            res,
            nuevoProducto,
            'Producto registrado con éxito.',
            201
            );
        } catch (error) {
            return responseHandler.error(
            res,
            'Error interno del servidor al crear producto.',
            500
            );
        }
        },

    getAllProductos: async (req, res) => {
        try {
            const productos = await ProductoModel.findAll();
            return responseHandler.success(
                res,
                productos,
                `Se encontraron ${productos.length} productos.`
            );
        } catch (error) {
            return responseHandler.error(
                res,
                'Error interno del servidor al obtener la lista de productos.'
            );
        }
    },

    getProductoById: async (req, res) => {
        const id = parseInt(req.params.id);
        
        try {
            const producto = await ProductoModel.findById(id);

            if (!producto) {
                return responseHandler.error(
                    res,
                    `Producto con ID ${id} no encontrado.`,
                    404
                );
            }
            
            return responseHandler.success(
                res,
                producto,
                'Producto encontrado con éxito.'
            );
        } catch (error) {
            return responseHandler.error(
                res,
                'Error interno del servidor al buscar producto.'
            );
        }
    },

    updateProducto: async (req, res) => {
        const id = parseInt(req.params.id);
        const data = { ...req.body };

        if (!id || Object.keys(data).length === 0) {
            return responseHandler.error(
            res,
            'Debe proporcionar al menos un campo para actualizar.',
            400
            );
        }

        try {
            const productoActualizado = await ProductoModel.update(id, data);

            if (!productoActualizado) {
            return responseHandler.error(
                res,
                `No se encontró producto con ID ${id}.`,
                404
            );
            }

            return responseHandler.success(
            res,
            productoActualizado,
            'Producto actualizado con éxito.'
            );
        } catch (error) {
            console.error('error', error);
            return responseHandler.error(
            res,
            'Error interno del servidor al actualizar el producto.',
            500
            );
        }
    },


    deleteProducto: async (req, res) => {
        const id = parseInt(req.params.id);

        try {
            const productoEliminado = await ProductoModel.remove(id);

            if (!productoEliminado) {
                return responseHandler.error(
                    res,
                    `Producto con ID ${id} no encontrado.`,
                    404
                );
            }
            
            return responseHandler.success(
                res,
                productoEliminado,
                'Producto eliminado con éxito.'
            );
        } catch (error) {
            if (error.code === '23503') { 
                return responseHandler.error(
                    res,
                    'No se puede eliminar el producto porque tiene lotes de inventario asociados. Elimine los lotes primero.',
                    409
                );
            }
            
            return responseHandler.error(
                res,
                'Error interno del servidor al eliminar producto.'
            );
        }
    }
};

module.exports = ProductoController;