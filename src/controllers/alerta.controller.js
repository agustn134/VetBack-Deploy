// src/controllers/alerta.controller.js
const alertaModel = require('../models/alerta.model');
const response = require('../utils/responseHandler'); // Asumo que usas responseHandler.js

const AlertaController = {
  /**
   * Obtiene todos los datos agregados para el dashboard.
   * Ejecuta las consultas en paralelo para mayor eficiencia.
   * Es tolerante a fallos: si una consulta falla, devuelve las otras.
   */
  getAlertasDashboard: async (req, res) => {
    // Hacemos los parámetros de query flexibles
    const limit = parseInt(req.query.limit, 10) || 5;
    const diasVencimiento = parseInt(req.query.dias, 10) || 30; // ¡Parámetro flexible añadido!

    try {
      // Ejecutamos TODAS las consultas en paralelo
      const results = await Promise.allSettled([
        alertaModel.getStockBajo(),
        alertaModel.getProductosAVencer(diasVencimiento), // Pasamos el parámetro
        alertaModel.getTopProductosVendidos(limit),
        alertaModel.getStatsCitasHoy(),
        alertaModel.getStatsCitasPorConfirmar(),      // ¡Nueva llamada!
        alertaModel.getStatsCitasProximaSemana(), // ¡Nueva llamada!
        alertaModel.getStatsNuevosClientesMes()     // ¡Nueva llamada!
      ]);

      // Procesamos los resultados
      const stockBajo = results[0].status === 'fulfilled' ? results[0].value : [];
      const productosAVencer = results[1].status === 'fulfilled' ? results[1].value : [];
      const topVendidos = results[2].status === 'fulfilled' ? results[2].value : [];
      
      // Agrupamos las estadísticas
      const statsCitas = {
        hoy: results[3].status === 'fulfilled' ? results[3].value : { total_citas_hoy: 0, citas_confirmadas: 0 },
        por_confirmar: results[4].status === 'fulfilled' ? results[4].value : { total_por_confirmar: 0 },
        proxima_semana: results[5].status === 'fulfilled' ? results[5].value : { total_proxima_semana: 0 }
      };
      
      const statsCrecimiento = {
        nuevos_clientes_mes: results[6].status === 'fulfilled' ? results[6].value : { total_nuevos_clientes: 0 }
      };

      // Opcional: Registrar errores si alguna promesa falló
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const metricas = ['StockBajo', 'ProductosAVencer', 'TopVendidos', 'StatsCitasHoy', 'CitasPorConfirmar', 'CitasProximaSemana', 'NuevosClientes'];
          console.error(
            `[Dashboard] Error al obtener la métrica ${metricas[index]}:`,
            result.reason.message
          );
        }
      });

      // Creamos el objeto de respuesta final
      const data = {
        alertasStockBajo: stockBajo,
        alertasProductosAVencer: productosAVencer,
        graficaTopVendidos: topVendidos,
        statsCitas: statsCitas,
        statsCrecimiento: statsCrecimiento
      };

      response.success(res, data, 'Datos del dashboard obtenidos.', 200);
    } catch (error) {
      // Este catch ahora solo atraparía errores muy inesperados
      console.error('Error catastrófico al obtener alertas del dashboard:', error);
      response.error(res, 'Error general al obtener alertas.', 500);
    }
  },









  // 4. Mejora de Estructura: Completar los controladores individuales
  // Esto es útil si quieres tener pantallas dedicadas solo a "Stock Bajo"
  // o "A Vencer", en lugar de solo el dashboard.
  
  listarStockBajo: async (req, res) => {
    try {
      const stockBajo = await alertaModel.getStockBajo();
      response.success(res, stockBajo, 'Lista de stock bajo obtenida.', 200);
    } catch (error) {
      console.error('Error al listar stock bajo:', error);
      response.error(res, 'Error al obtener lista de stock bajo.', 500);
    }
  },

  listarProductosAVencer: async (req, res) => {
    try {
      const productosAVencer = await alertaModel.getProductosAVencer();
      response.success(res, productosAVencer, 'Lista de productos a vencer obtenida.', 200);
    } catch (error) {
      console.error('Error al listar productos a vencer:', error);
      response.error(res, 'Error al obtener lista de productos a vencer.', 500);
    }
  }
};

module.exports = AlertaController;