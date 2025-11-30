const DiagnosticoModel = require('../models/diagnostico.model');
const responseHandler = require('../utils/responseHandler');

const DiagnosticoController = {
  async upsertDiagnosticos(req, res) {
    try {
      const { consulta_id, diagnosticos } = req.body;

      if (!consulta_id)
        return responseHandler.error(res, 'consulta_id es obligatorio.', 400);

      if (!diagnosticos || !Array.isArray(diagnosticos) || diagnosticos.length === 0)
        return responseHandler.error(res, 'diagnosticos debe ser un array con al menos un elemento.', 400);

      const resultados = [];

      for (const diag of diagnosticos) {
        if (!diag.descripcion || diag.descripcion.trim() === '') {
          return responseHandler.error(res, 'descripcion es obligatoria en todos los diagnósticos.', 400);
        }

        let resultado;

        if (diag.id_diagnostico) {
          resultado = await DiagnosticoModel.update(diag.id_diagnostico, {
            descripcion: diag.descripcion.trim(),
            tipo: diag.tipo || 'Primario'
          });
        } else {
          resultado = await DiagnosticoModel.create({
            consulta_id,
            descripcion: diag.descripcion.trim(),
            tipo: diag.tipo || 'Primario'
          });
        }

        resultados.push(resultado);
      }

      return responseHandler.success(
        res,
        resultados,
        `${resultados.length} diagnóstico(s) procesado(s) correctamente.`,
        200
      );

    } catch (error) {
      console.error('[ERROR UPSERT DIAGNOSTICOS]', error);
      return responseHandler.error(res, 'Error al procesar diagnóstico(s).', 500);
    }
  },

  async obtenerDiagnostico(req, res) {
    try {
      const diagnostico = await DiagnosticoModel.findById(req.params.id);
      if (!diagnostico)
        return responseHandler.error(res, 'Diagnóstico no encontrado.', 404);
      return responseHandler.success(res, diagnostico, 'Diagnóstico encontrado.');
    } catch (error) {
      return responseHandler.error(res, 'Error al obtener diagnóstico.', 500);
    }
  },

  async obtenerPorConsulta(req, res) {
    try {
      const diagnosticos = await DiagnosticoModel.findByConsulta(req.params.consulta_id);
      return responseHandler.success(
        res,
        diagnosticos,
        `Total: ${diagnosticos.length} diagnóstico(s).`
      );
    } catch (error) {
      return responseHandler.error(res, 'Error al listar diagnósticos.', 500);
    }
  },

  async eliminarDiagnostico(req, res) {
    try {
      const diagnostico = await DiagnosticoModel.delete(req.params.id);
      if (!diagnostico)
        return responseHandler.error(res, 'Diagnóstico no encontrado.', 404);
      return responseHandler.success(res, diagnostico, 'Diagnóstico eliminado.');
    } catch (error) {
      return responseHandler.error(res, 'Error al eliminar diagnóstico.', 500);
    }
  }
};

module.exports = DiagnosticoController;