const CategoriaModel = require('../models/categoria.model');
const responseHandler = require('../utils/responseHandler');

const CategoriaController = {
  getAllCategorias: async (req, res) => {
    try {
      const categorias = await CategoriaModel.findAll();
      return responseHandler.success(
        res,
        categorias,
        `Se encontraron ${categorias.length} categorías.`
      );
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      return responseHandler.error(
        res,
        "Error interno del servidor al obtener categorías."
      );
    }
  },

  getCategoriaById: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const categoria = await CategoriaModel.findById(id);
      if (!categoria) {
        return responseHandler.error(res, `Categoría con ID ${id} no encontrada.`, 404);
      }
      return responseHandler.success(res, categoria, "Categoría encontrada con éxito.");
    } catch (error) {
      return responseHandler.error(res, "Error interno al obtener la categoría.");
    }
  },
  
  createCategoria: async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
      return responseHandler.error(res, "El nombre es obligatorio.", 400);
    }

    try {
      const nuevaCategoria = await CategoriaModel.create({ nombre });
      return responseHandler.success(
        res,
        nuevaCategoria,
        "Categoría creada correctamente.",
        201
      );
    } catch (error) {
      console.error("Error al crear categoría:", error);
      return responseHandler.error(
        res,
        "Error interno del servidor al crear la categoría."
      );
    }
  }
};

module.exports = CategoriaController;
