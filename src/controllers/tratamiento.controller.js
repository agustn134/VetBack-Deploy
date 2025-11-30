// const TratamientoModel = require('../models/tratamiento.model');
// const responseHandler = require('../utils/responseHandler');

// const TratamientoController = {

//   async upsertTratamientos(req, res) {
//     try {
//       const { consulta_id, tratamientos } = req.body;

//       if (!consulta_id)
//         return responseHandler.error(res, 'consulta_id es obligatorio.', 400);

//       if (!tratamientos || !Array.isArray(tratamientos) || tratamientos.length === 0)
//         return responseHandler.error(res, 'Debe enviar al menos un tratamiento.', 400);

//       let resultados = [];

//       for (const t of tratamientos) {
//         if (!t.medicamento)
//           return responseHandler.error(res, 'medicamento es obligatorio.', 400);
//         if (!t.dosis)
//           return responseHandler.error(res, 'dosis es obligatoria.', 400);
//         if (!t.frecuencia)
//           return responseHandler.error(res, 'frecuencia es obligatoria.', 400);

//         let resultado;

//         if (t.id_tratamiento) {
//           resultado = await TratamientoModel.update(t.id_tratamiento, {
//             medicamento: t.medicamento,
//             dosis: t.dosis,
//             frecuencia: t.frecuencia,
//             duracion_dias: t.duracion_dias || null,
//             via_administracion: t.via_administracion || null,
//             indicaciones: t.indicaciones || null,
//             fecha_inicio: t.fecha_inicio || new Date().toISOString().split("T")[0],
//             fecha_fin: t.fecha_fin || null
//           });
//         } else {
//           resultado = await TratamientoModel.create({
//             consulta_id,
//             medicamento: t.medicamento,
//             dosis: t.dosis,
//             frecuencia: t.frecuencia,
//             duracion_dias: t.duracion_dias || null,
//             via_administracion: t.via_administracion || null,
//             indicaciones: t.indicaciones || null,
//             fecha_inicio: t.fecha_inicio || new Date().toISOString().split("T")[0],
//             fecha_fin: t.fecha_fin || null
//           });
//         }

//         resultados.push(resultado);
//       }

//       return responseHandler.success(
//         res,
//         resultados,
//         `${resultados.length} tratamiento(s) procesado(s) correctamente.`,
//         200
//       );

//     } catch (error) {
//       console.error('[TRATAMIENTO] Error:', error);
//       return responseHandler.error(res, 'Error al procesar tratamiento(s).', 500);
//     }
//   },

//   async obtenerTratamiento(req, res) {
//     try {
//       const tratamiento = await TratamientoModel.findById(req.params.id);
//       if (!tratamiento)
//         return responseHandler.error(res, 'Tratamiento no encontrado.', 404);
//       return responseHandler.success(res, tratamiento, 'Tratamiento encontrado.');
//     } catch (error) {
//       return responseHandler.error(res, 'Error al obtener tratamiento.', 500);
//     }
//   },

//   async obtenerPorConsulta(req, res) {
//     try {
//       const tratamientos = await TratamientoModel.findByConsulta(req.params.consulta_id);
//       return responseHandler.success(
//         res,
//         tratamientos,
//         `Total: ${tratamientos.length} tratamiento(s).`
//       );
//     } catch (error) {
//       return responseHandler.error(res, 'Error al listar tratamientos.', 500);
//     }
//   },

//   async eliminarTratamiento(req, res) {
//     try {
//       const tratamiento = await TratamientoModel.delete(req.params.id);
//       if (!tratamiento)
//         return responseHandler.error(res, 'Tratamiento no encontrado.', 404);
//       return responseHandler.success(res, tratamiento, 'Tratamiento eliminado.');
//     } catch (error) {
//       return responseHandler.error(res, 'Error al eliminar tratamiento.', 500);
//     }
//   }
// };

// module.exports = TratamientoController;

const TratamientoModel = require('../models/tratamiento.model');
const responseHandler = require('../utils/responseHandler');
const consultaFacade = require('../facades/consulta.facade'); 

const TratamientoController = {

  async upsertTratamientos(req, res) {
    try {
      const { consulta_id, tratamientos } = req.body;
      
      const usuarioId = req.user ? req.user.id : 1;

      if (!consulta_id)
        return responseHandler.error(res, 'consulta_id es obligatorio.', 400);

      if (!tratamientos || !Array.isArray(tratamientos) || tratamientos.length === 0)
        return responseHandler.error(res, 'Debe enviar al menos un tratamiento.', 400);

      let resultados = [];

      for (const t of tratamientos) {
        if (!t.medicamento)
          return responseHandler.error(res, 'medicamento es obligatorio.', 400);
        if (!t.dosis)
          return responseHandler.error(res, 'dosis es obligatoria.', 400);
        if (!t.frecuencia)
          return responseHandler.error(res, 'frecuencia es obligatoria.', 400);

        let resultado;

        if (t.id_tratamiento) {
          // Actualización: Usamos el modelo directo
          resultado = await TratamientoModel.update(t.id_tratamiento, {
            medicamento: t.medicamento,
            dosis: t.dosis,
            frecuencia: t.frecuencia,
            duracion_dias: t.duracion_dias || null,
            via_administracion: t.via_administracion || null,
            indicaciones: t.indicaciones || null,
            fecha_inicio: t.fecha_inicio || new Date().toISOString().split("T")[0],
            fecha_fin: t.fecha_fin || null
          });
        } else {
          // Creación: Usamos la FACHADA para descontar del inventario
          resultado = await consultaFacade.registrarTratamiento({
            consulta_id,
            medicamento: t.medicamento,
            dosis: t.dosis,
            frecuencia: t.frecuencia,
            duracion_dias: t.duracion_dias || null,
            via_administracion: t.via_administracion || null,
            indicaciones: t.indicaciones || null,
            fecha_inicio: t.fecha_inicio || new Date().toISOString().split("T")[0],
            fecha_fin: t.fecha_fin || null,
            producto_id: t.producto_id, // ID del producto en inventario (si existe)
            cantidad_inventario: t.cantidad_inventario // Cantidad a descontar (opcional, default 1)
          }, usuarioId);
        }

        resultados.push(resultado);
      }

      return responseHandler.success(
        res,
        resultados,
        `${resultados.length} tratamiento(s) procesado(s) correctamente.`,
        200
      );

    } catch (error) {
      console.error('[TRATAMIENTO] Error:', error);
      return responseHandler.error(res, 'Error al procesar tratamiento(s).', 500);
    }
  },

  async obtenerTratamiento(req, res) {
    try {
      const tratamiento = await TratamientoModel.findById(req.params.id);
      if (!tratamiento)
        return responseHandler.error(res, 'Tratamiento no encontrado.', 404);
      return responseHandler.success(res, tratamiento, 'Tratamiento encontrado.');
    } catch (error) {
      return responseHandler.error(res, 'Error al obtener tratamiento.', 500);
    }
  },

  async obtenerPorConsulta(req, res) {
    try {
      const tratamientos = await TratamientoModel.findByConsulta(req.params.consulta_id);
      return responseHandler.success(
        res,
        tratamientos,
        `Total: ${tratamientos.length} tratamiento(s).`
      );
    } catch (error) {
      return responseHandler.error(res, 'Error al listar tratamientos.', 500);
    }
  },

  async eliminarTratamiento(req, res) {
    try {
      const tratamiento = await TratamientoModel.delete(req.params.id);
      if (!tratamiento)
        return responseHandler.error(res, 'Tratamiento no encontrado.', 404);
      return responseHandler.success(res, tratamiento, 'Tratamiento eliminado.');
    } catch (error) {
      return responseHandler.error(res, 'Error al eliminar tratamiento.', 500);
    }
  }
};

module.exports = TratamientoController;