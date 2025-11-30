const HistorialCambiosModel = require('../models/cambios.model');

async function registrarCambio({
  expediente_id,
  consulta_id,
  usuario_id,
  tipo_cambio,
  tabla_afectada,
  descripcion
}) {

  return await HistorialCambiosModel.registrar({
    expediente_id,
    consulta_id,
    usuario_id,
    tipo_cambio,
    tabla_afectada,
    descripcion
  });
}

module.exports = registrarCambio;
