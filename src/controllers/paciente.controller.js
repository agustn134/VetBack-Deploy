// src/controllers/paciente.controller.js
const PacienteModel = require('../models/paciente.model');
const responseHandler = require('../utils/responseHandler');

const crearPaciente = async (req, res) => {
  try {
    const { cliente_id, nombre, animal_id, raza, edad, peso } = req.body;

    if (!cliente_id || !nombre) {
      return responseHandler.error(
        res,
        'cliente_id y nombre son obligatorios.',
        400
      );
    }

    const paciente = await PacienteModel.create({
      cliente_id,
      nombre,
      animal_id,
      raza,
      edad,
      peso,
    });

    return responseHandler.success(
      res,
      paciente,
      'Paciente creado correctamente.',
      201
    );
  } catch (error) {
    console.error('[CONTROLADOR PACIENTE] Error al crear paciente:', error);
    return responseHandler.error(res, 'Error al crear paciente.', 500);
  }
};

const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await PacienteModel.findAll();
    return responseHandler.success(
      res,
      pacientes,
      'Pacientes obtenidos correctamente.'
    );
  } catch (error) {
    console.error('[CONTROLADOR PACIENTE] Error al obtener pacientes:', error);
    return responseHandler.error(res, 'Error al obtener pacientes.', 500);
  }
};

const obtenerPacientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await PacienteModel.findById(id);

    if (!paciente) {
      return responseHandler.error(res, 'Paciente no encontrado.', 404);
    }

    return responseHandler.success(res, paciente, 'Paciente encontrado.');
  } catch (error) {
    console.error('[CONTROLADOR PACIENTE] Error al obtener paciente:', error);
    return responseHandler.error(res, 'Error al obtener paciente.', 500);
  }
};

const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const actualizado = await PacienteModel.update(id, datos);

    if (!actualizado) {
      return responseHandler.error(res, 'Paciente no encontrado.', 404);
    }

    return responseHandler.success(
      res,
      actualizado,
      'Paciente actualizado correctamente.'
    );
  } catch (error) {
    console.error('[CONTROLADOR PACIENTE] Error al actualizar paciente:', error);
    return responseHandler.error(res, 'Error al actualizar paciente.', 500);
  }
};

const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await PacienteModel.delete(id);

    if (!eliminado) {
      return responseHandler.error(res, 'Paciente no encontrado.', 404);
    }

    return responseHandler.success(
      res,
      eliminado,
      'Paciente eliminado correctamente.'
    );
  } catch (error) {
    console.error('[CONTROLADOR PACIENTE] Error al eliminar paciente:', error);
    return responseHandler.error(res, 'Error al eliminar paciente.', 500);
  }
};

module.exports = {
  crearPaciente,
  obtenerPacientes,
  obtenerPacientePorId,
  actualizarPaciente,
  eliminarPaciente,
};
