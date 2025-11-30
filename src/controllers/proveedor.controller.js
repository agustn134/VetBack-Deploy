const ProveedorModel = require('../models/proveedor.model');
const responseHandler = require('../utils/responseHandler');

const ProveedorController = {
  getAll: async (req, res) => {
    try {
      const proveedores = await ProveedorModel.findAll();
      return responseHandler.success(res, proveedores, 'Lista de proveedores obtenida con éxito');
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      return responseHandler.error(res, 'Error al obtener los proveedores', 500);
    }
  },

  create: async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
      return responseHandler.error(res, 'El nombre del proveedor es obligatorio.', 400);
    }

    try {
      const nuevo = await ProveedorModel.create(req.body);
      return responseHandler.success(res, nuevo, 'Proveedor registrado correctamente', 201);
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      return responseHandler.error(res, 'Error al registrar proveedor', 500);
    }
  }
};

module.exports = ProveedorController;
