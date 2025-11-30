// const VacunaModel = require('../models/vacuna.model');
// const responseHandler = require('../utils/responseHandler');
// const consultaFacade = require('../facades/consulta.facade'); // Importar fachada

// const VacunaController = {

//   async upsertVacunas(req, res) {
//     try {
//       const { consulta_id, vacunas } = req.body;

//       if (!consulta_id)
//         return responseHandler.error(res, 'consulta_id es obligatorio.', 400);

//       if (!vacunas || !Array.isArray(vacunas) || vacunas.length === 0)
//         return responseHandler.error(res, 'Debe enviar al menos una vacuna.', 400);

//       const resultados = [];

//       for (let vac of vacunas) {
//         let {
//           id_vacuna,
//           nombre_vacuna,
//           fecha_aplicacion,
//           proxima_dosis,
//           sitio_aplicacion,
//           reacciones_adversas
//         } = vac;

//         if (!nombre_vacuna)
//           return responseHandler.error(res, 'nombre_vacuna es obligatorio.', 400);

//         if (!proxima_dosis) {
//           const fecha = new Date(fecha_aplicacion || Date.now());
//           const nombre = nombre_vacuna.trim().toLowerCase();

//           if (nombre.includes("rabia")) {
//             fecha.setFullYear(fecha.getFullYear() + 1);
//           } else if (nombre.includes("bordetella")) {
//             fecha.setMonth(fecha.getMonth() + 6);
//           } else if (nombre.includes("desparasit")) {
//             fecha.setMonth(fecha.getMonth() + 3);
//           } else {
//             fecha.setFullYear(fecha.getFullYear() + 1);
//           }

//           proxima_dosis = fecha.toISOString().split("T")[0];
//         }

//         let resultado;

//         if (id_vacuna) {
//           resultado = await VacunaModel.update(id_vacuna, {
//             nombre_vacuna,
//             fecha_aplicacion,
//             proxima_dosis,
//             sitio_aplicacion,
//             reacciones_adversas
//           });
//         } else {
//           resultado = await VacunaModel.create({
//             consulta_id,
//             nombre_vacuna,
//             fecha_aplicacion,
//             proxima_dosis,
//             sitio_aplicacion,
//             reacciones_adversas
//           });
//         }

//         resultados.push(resultado);
//       }

//       return responseHandler.success(
//         res,
//         resultados,
//         `${resultados.length} vacuna(s) procesada(s) correctamente.`,
//         200
//       );

//     } catch (error) {
//       console.error('[VACUNA] Error al registrar:', error);
//       return responseHandler.error(res, 'Error al procesar vacuna(s).', 500);
//     }
//   },

//   async obtenerVacuna(req, res) {
//     try {
//       const vacuna = await VacunaModel.findById(req.params.id);
//       if (!vacuna)
//         return responseHandler.error(res, 'Vacuna no encontrada.', 404);
//       return responseHandler.success(res, vacuna, 'Vacuna encontrada.');
//     } catch (error) {
//       return responseHandler.error(res, 'Error al obtener vacuna.', 500);
//     }
//   },

//   async obtenerPorConsulta(req, res) {
//     try {
//       const vacunas = await VacunaModel.findByConsulta(req.params.consulta_id);
//       return responseHandler.success(
//         res,
//         vacunas,
//         `Total: ${vacunas.length} vacuna(s)`
//       );
//     } catch (error) {
//       return responseHandler.error(res, 'Error al listar vacunas.', 500);
//     }
//   },

//   async eliminarVacuna(req, res) {
//     try {
//       const vacuna = await VacunaModel.delete(req.params.id);
//       if (!vacuna)
//         return responseHandler.error(res, 'Vacuna no encontrada.', 404);
//       return responseHandler.success(res, vacuna, 'Vacuna eliminada correctamente.');
//     } catch (error) {
//       return responseHandler.error(res, 'Error al eliminar vacuna.', 500);
//     }
//   }
// };

// module.exports = VacunaController;




const VacunaModel = require('../models/vacuna.model');
const responseHandler = require('../utils/responseHandler');
const consultaFacade = require('../facades/consulta.facade'); // Importamos la fachada

const VacunaController = {

  async upsertVacunas(req, res) {
    try {
      const { consulta_id, vacunas } = req.body;
      
      // Obtenemos el ID del usuario que hace la operación (para el historial de movimientos)
      // Si no hay usuario en req (ej. pruebas sin auth), usamos 1 por defecto
      const usuarioId = req.user ? req.user.id : 1;

      if (!consulta_id)
        return responseHandler.error(res, 'consulta_id es obligatorio.', 400);

      if (!vacunas || !Array.isArray(vacunas) || vacunas.length === 0)
        return responseHandler.error(res, 'Debe enviar al menos una vacuna.', 400);

      const resultados = [];

      for (let vac of vacunas) {
        let {
          id_vacuna,
          nombre_vacuna,
          fecha_aplicacion,
          proxima_dosis,
          sitio_aplicacion,
          reacciones_adversas,
          producto_id // <--- 1. Extraemos el ID del producto asociado
        } = vac;

        if (!nombre_vacuna)
          return responseHandler.error(res, 'nombre_vacuna es obligatorio.', 400);

        // Lógica de cálculo de próxima dosis (se mantiene igual)
        if (!proxima_dosis) {
          const fecha = new Date(fecha_aplicacion || Date.now());
          const nombre = nombre_vacuna.trim().toLowerCase();

          if (nombre.includes("rabia")) {
            fecha.setFullYear(fecha.getFullYear() + 1);
          } else if (nombre.includes("bordetella")) {
            fecha.setMonth(fecha.getMonth() + 6);
          } else if (nombre.includes("desparasit")) {
            fecha.setMonth(fecha.getMonth() + 3);
          } else {
            fecha.setFullYear(fecha.getFullYear() + 1);
          }

          proxima_dosis = fecha.toISOString().split("T")[0];
        }

        let resultado;

        if (id_vacuna) {
          // Si es actualización, usamos el Modelo directamente (no descontamos inventario de nuevo para evitar duplicados)
          // Si quisieras permitir cambiar el producto, la lógica sería mucho más compleja (devolver el anterior, restar el nuevo)
          resultado = await VacunaModel.update(id_vacuna, {
            nombre_vacuna,
            fecha_aplicacion,
            proxima_dosis,
            sitio_aplicacion,
            reacciones_adversas
          });
        } else {
          // Si es CREACIÓN, usamos la FACHADA para descontar inventario
          // La fachada se encarga de: Guardar Vacuna + Buscar Lote FIFO + Restar Stock + Registrar Movimiento
          resultado = await consultaFacade.registrarVacuna({
            consulta_id,
            nombre_vacuna,
            fecha_aplicacion,
            proxima_dosis,
            sitio_aplicacion,
            reacciones_adversas,
            producto_id // Pasamos el ID para que la fachada busque el lote
          }, usuarioId);
        }

        resultados.push(resultado);
      }

      return responseHandler.success(
        res,
        resultados,
        `${resultados.length} vacuna(s) procesada(s) correctamente.`,
        200
      );

    } catch (error) {
      console.error('[VACUNA] Error al registrar:', error);
      return responseHandler.error(res, 'Error al procesar vacuna(s).', 500);
    }
  },

  async obtenerVacuna(req, res) {
    try {
      const vacuna = await VacunaModel.findById(req.params.id);
      if (!vacuna)
        return responseHandler.error(res, 'Vacuna no encontrada.', 404);
      return responseHandler.success(res, vacuna, 'Vacuna encontrada.');
    } catch (error) {
      return responseHandler.error(res, 'Error al obtener vacuna.', 500);
    }
  },

  async obtenerPorConsulta(req, res) {
    try {
      const vacunas = await VacunaModel.findByConsulta(req.params.consulta_id);
      return responseHandler.success(
        res,
        vacunas,
        `Total: ${vacunas.length} vacuna(s)`
      );
    } catch (error) {
      return responseHandler.error(res, 'Error al listar vacunas.', 500);
    }
  },

  async eliminarVacuna(req, res) {
    try {
      const vacuna = await VacunaModel.delete(req.params.id);
      if (!vacuna)
        return responseHandler.error(res, 'Vacuna no encontrada.', 404);
      return responseHandler.success(res, vacuna, 'Vacuna eliminada correctamente.');
    } catch (error) {
      return responseHandler.error(res, 'Error al eliminar vacuna.', 500);
    }
  }
};

module.exports = VacunaController;