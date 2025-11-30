const ConsultaModel = require('../models/consulta.model');
const responseHandler = require('../utils/responseHandler');

const ConsultaController = {

  async crearConsulta(req, res) {
    try {
      const {
        expediente_id,
        veterinario_id,
        peso_actual,
        temperatura,
        frecuencia_cardiaca,
        frecuencia_respiratoria,
        motivo_consulta,
        sintomas,
        observaciones
      } = req.body;

      if (!expediente_id)
        return responseHandler.error(res, 'expediente_id es obligatorio.', 400);

      if (!veterinario_id)
        return responseHandler.error(res, 'veterinario_id es obligatorio.', 400);

      if (!motivo_consulta)
        return responseHandler.error(res, 'motivo_consulta es obligatorio.', 400);

      const consulta = await ConsultaModel.create({
        expediente_id,
        veterinario_id,
        peso_actual,
        temperatura,
        frecuencia_cardiaca,
        frecuencia_respiratoria,
        motivo_consulta,
        sintomas,
        observaciones
      });

      return responseHandler.success(res, consulta, 'Consulta creada correctamente.', 201);

    } catch (error) {
      console.error(error);
      return responseHandler.error(res, 'Error al crear consulta.', 500);
    }
  },

  async obtenerConsulta(req, res) {
    try {
      const consulta = await ConsultaModel.findById(req.params.id);

      if (!consulta)
        return responseHandler.error(res, 'Consulta no encontrada.', 404);

      return responseHandler.success(res, consulta, 'Consulta encontrada.');

    } catch (error) {
      console.error(error);
      return responseHandler.error(res, 'Error al obtener consulta.', 500);
    }
  },

  async obtenerPorExpediente(req, res) {
    try {
      const consultas = await ConsultaModel.findByExpediente(req.params.expediente_id);

      return responseHandler.success(
        res,
        consultas,
        `Total consultas: ${consultas.length}`
      );

    } catch (error) {
      console.error(error);
      return responseHandler.error(res, 'Error al obtener consultas.', 500);
    }
  },

  async actualizarConsulta(req, res) {
    try {
      const consulta = await ConsultaModel.update(req.params.id, req.body);

      if (!consulta)
        return responseHandler.error(res, 'Consulta no encontrada.', 404);

      return responseHandler.success(res, consulta, 'Consulta actualizada.');

    } catch (error) {
      console.error(error);
      return responseHandler.error(res, 'Error al actualizar consulta.', 500);
    }
  },

  async eliminarConsulta(req, res) {
    try {
      const consulta = await ConsultaModel.delete(req.params.id);

      if (!consulta)
        return responseHandler.error(res, 'Consulta no encontrada.', 404);

      return responseHandler.success(res, consulta, 'Consulta eliminada.');

    } catch (error) {
      console.error(error);
      return responseHandler.error(res, 'Error al eliminar consulta.', 500);
    }
  }

};

module.exports = ConsultaController;
