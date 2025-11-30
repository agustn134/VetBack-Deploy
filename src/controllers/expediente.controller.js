const ExpedienteModel = require('../models/expediente.model');
const responseHandler = require('../utils/responseHandler');

// =====================================
const crearExpediente = async (req, res) => {
  try {
    const { paciente_id, observaciones_generales } = req.body;

    if (!paciente_id) {
      return responseHandler.error(
        res,
        'El paciente_id es obligatorio para crear un expediente.',
        400
      );
    }

    const expediente = await ExpedienteModel.create({
      paciente_id,
      observaciones_generales,
    });

    return responseHandler.success(
      res,
      expediente,
      'Expediente creado correctamente.',
      201
    );

  } catch (error) {
    console.error('[CONTROLADOR EXPEDIENTE] Error al crear expediente:', error);
    return responseHandler.error(res, 'Error al crear expediente.', 500);
  }
};

const obtenerExpedientes = async (req, res) => {
  try {
    const expedientes = await ExpedienteModel.findAll();
    return responseHandler.success(
      res,
      expedientes,
      'Expedientes obtenidos correctamente.'
    );
  } catch (error) {
    console.error('[CONTROLADOR EXPEDIENTE] Error al obtener expedientes:', error);
    return responseHandler.error(res, 'Error al obtener expedientes.', 500);
  }
};

const obtenerExpedientePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const expediente = await ExpedienteModel.findById(id);

    if (!expediente) {
      return responseHandler.error(res, 'Expediente no encontrado.', 404);
    }

    return responseHandler.success(res, expediente, 'Expediente encontrado.');
  } catch (error) {
    console.error('[CONTROLADOR EXPEDIENTE] Error al obtener expediente:', error);
    return responseHandler.error(res, 'Error al obtener expediente.', 500);
  }
};

const actualizarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const { observaciones_generales, estado } = req.body;

    const actualizado = await ExpedienteModel.update(id, {
      observaciones_generales,
      estado,
    });

    if (!actualizado) {
      return responseHandler.error(res, 'Expediente no encontrado.', 404);
    }

    return responseHandler.success(
      res,
      actualizado,
      'Expediente actualizado correctamente.'
    );

  } catch (error) {
    console.error('[CONTROLADOR EXPEDIENTE] Error al actualizar expediente:', error);
    return responseHandler.error(res, 'Error al actualizar expediente.', 500);
  }
};


const eliminarExpediente = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await ExpedienteModel.delete(id);

    if (!eliminado) {
      return responseHandler.error(res, 'Expediente no encontrado.', 404);
    }

    return responseHandler.success(
      res,
      eliminado,
      'Expediente eliminado correctamente.'
    );

  } catch (error) {
    console.error('[CONTROLADOR EXPEDIENTE] Error al eliminar expediente:', error);
    return responseHandler.error(res, 'Error al eliminar expediente.', 500);
  }
};


const buscarExpedientes = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return responseHandler.error(res, 'Debe proporcionar un término de búsqueda.', 400);
    }

    const resultados = await ExpedienteModel.search(q);

    return responseHandler.success(
      res,
      resultados,
      `Se encontraron ${resultados.length} expediente(s).`
    );

  } catch (error) {
    console.error('[CONTROLADOR EXPEDIENTE] Error al buscar expedientes:', error);
    return responseHandler.error(res, 'Error al buscar expedientes.', 500);
  }

  
};

const obtenerExpedienteDetalle = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await ExpedienteModel.findDetalle(id);

    if (!detalle) {
      return responseHandler.error(res, 'Expediente no encontrado.', 404);
    }

    return responseHandler.success(
      res,
      detalle,
      'Expediente completo obtenido correctamente.'
    );

  } catch (error) {
    console.error('[CONTROLADOR EXPEDIENTE] Error obtener detalle:', error);
    return responseHandler.error(res, 'Error al obtener detalle del expediente.', 500);
  }
};

async function obtenerPorPaciente(req, res) {
  try {
    const { paciente_id } = req.params;

    const expedientes = await ExpedienteModel.findByPaciente(paciente_id);

    return responseHandler.success(
      res,
      expedientes,
      'Expedientes del paciente obtenidos correctamente.'
    );

  } catch (error) {
    console.error('[EXPEDIENTES] Error obtener por paciente:', error);
    return responseHandler.error(res, 'Error al obtener expedientes por paciente', 500);
  }
}

const obtenerTodosExpedientesPorPaciente = async (req, res) => {
  try {
    const { paciente_id } = req.params;

    console.log('📋 Obteniendo todos los expedientes del paciente:', paciente_id);

    const expedientes = await ExpedienteModel.findAllByPaciente(paciente_id);

    return responseHandler.success(
      res,
      expedientes,
      `Se encontraron ${expedientes.length} expediente(s) del paciente.`
    );

  } catch (error) {
    console.error('[CONTROLADOR EXPEDIENTE] Error al obtener todos los expedientes:', error);
    return responseHandler.error(res, 'Error al obtener expedientes del paciente.', 500);
  }
};

/**
 * Obtener expediente completo con todas sus relaciones
 */
const obtenerExpedienteCompleto = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('📂 Obteniendo expediente completo ID:', id);

    const expedienteCompleto = await ExpedienteModel.findCompleto(id);

    if (!expedienteCompleto) {
      return responseHandler.error(res, 'Expediente no encontrado.', 404);
    }

    return responseHandler.success(
      res,
      expedienteCompleto,
      'Expediente completo obtenido correctamente.'
    );

  } catch (error) {
    console.error('[CONTROLADOR EXPEDIENTE] Error al obtener expediente completo:', error);
    return responseHandler.error(res, 'Error al obtener expediente completo.', 500);
  }
};


module.exports = {
  crearExpediente,
  obtenerExpedientes,
  obtenerExpedientePorId,
  actualizarExpediente,
  eliminarExpediente,
  buscarExpedientes,
  obtenerExpedienteDetalle,
  obtenerPorPaciente,
  obtenerTodosExpedientesPorPaciente,  // NUEVO
  obtenerExpedienteCompleto             
};
