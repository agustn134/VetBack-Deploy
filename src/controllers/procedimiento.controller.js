const ProcedimientoModel = require('../models/procedimiento.model');
const responseHandler = require('../utils/responseHandler');

const ProcedimientoController = {

  async upsertProcedimientos(req, res) {
    try {
      const { consulta_id, procedimientos } = req.body;

      if (!consulta_id) {
        return responseHandler.error(res, 'consulta_id es obligatorio.', 400);
      }

      if (!procedimientos || !Array.isArray(procedimientos) || procedimientos.length === 0) {
        return responseHandler.error(
          res,
          'Debe enviar al menos un procedimiento en el arreglo "procedimientos".',
          400
        );
      }

      const creados = [];

      for (const p of procedimientos) {
        const {
          id_procedimiento,
          tipo_procedimiento,
          nombre_procedimiento,
          descripcion,
          fecha_realizacion,
          hora_inicio,
          hora_fin,
          anestesia_utilizada,
          complicaciones,
          observaciones
        } = p;

        if (!nombre_procedimiento || nombre_procedimiento.trim() === '') {
          return responseHandler.error(
            res,
            'nombre_procedimiento es obligatorio en todos los procedimientos.',
            400
          );
        }

        let resultado;

        if (id_procedimiento) {
          resultado = await ProcedimientoModel.update(id_procedimiento, {
            tipo_procedimiento: tipo_procedimiento || null,
            nombre_procedimiento: nombre_procedimiento.trim(),
            descripcion: descripcion || null,
            fecha_realizacion: fecha_realizacion || null,
            hora_inicio: hora_inicio || null,
            hora_fin: hora_fin || null,
            anestesia_utilizada: anestesia_utilizada || null,
            complicaciones: complicaciones || null,
            observaciones: observaciones || null
          });
        } else {
          resultado = await ProcedimientoModel.create({
            consulta_id,
            tipo_procedimiento: tipo_procedimiento || null,
            nombre_procedimiento: nombre_procedimiento.trim(),
            descripcion: descripcion || null,
            fecha_realizacion: fecha_realizacion || null,
            hora_inicio: hora_inicio || null,
            hora_fin: hora_fin || null,
            anestesia_utilizada: anestesia_utilizada || null,
            complicaciones: complicaciones || null,
            observaciones: observaciones || null
          });
        }

        creados.push(resultado);
      }

      return responseHandler.success(
        res,
        creados,
        `${creados.length} procedimiento(s) procesado(s) correctamente.`,
        200
      );

    } catch (error) {
      console.error('[PROCEDIMIENTO] Error al registrar:', error);
      return responseHandler.error(res, 'Error al procesar procedimiento(s).', 500);
    }
  },

  async obtenerProcedimiento(req, res) {
    try {
      const procedimiento = await ProcedimientoModel.findById(req.params.id);
      if (!procedimiento)
        return responseHandler.error(res, 'Procedimiento no encontrado.', 404);
      return responseHandler.success(res, procedimiento, 'Procedimiento encontrado.');
    } catch (error) {
      return responseHandler.error(res, 'Error al obtener procedimiento.', 500);
    }
  },

  async obtenerPorConsulta(req, res) {
    try {
      const procedimientos = await ProcedimientoModel.findByConsulta(req.params.consulta_id);
      return responseHandler.success(
        res,
        procedimientos,
        `Total: ${procedimientos.length} procedimiento(s)`
      );
    } catch (error) {
      return responseHandler.error(res, 'Error al listar procedimientos.', 500);
    }
  },

  async eliminarProcedimiento(req, res) {
    try {
      const procedimiento = await ProcedimientoModel.delete(req.params.id);
      if (!procedimiento)
        return responseHandler.error(res, 'Procedimiento no encontrado.', 404);
      return responseHandler.success(
        res,
        procedimiento,
        'Procedimiento eliminado correctamente.'
      );
    } catch (error) {
      return responseHandler.error(res, 'Error al eliminar procedimiento.', 500);
    }
  }
};

module.exports = ProcedimientoController;