const HistorialCambiosModel = require('../models/cambios.model');
const responseHandler = require('../utils/responseHandler');

const CambiosController = {

  async obtenerPorExpediente(req, res) {
    try {
      const { expediente_id } = req.params;
      const cambios = await HistorialCambiosModel.findByExpediente(expediente_id);

      return responseHandler.success(
        res,
        cambios,
        `Se encontraron ${cambios.length} cambio(s).`
      );
    } catch (error) {
      console.error(error);
      return responseHandler.error(res, 'Error al obtener historial.', 500);
    }
  },

  async obtenerPorConsulta(req, res) {
    try {
      const { consulta_id } = req.params;
      const cambios = await HistorialCambiosModel.findByConsulta(consulta_id);

      return responseHandler.success(
        res,
        cambios,
        `Se encontraron ${cambios.length} cambio(s).`
      );
    } catch (error) {
      console.error(error);
      return responseHandler.error(res, 'Error al obtener historial.', 500);
    }
  }
};

module.exports = CambiosController;
