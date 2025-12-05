const CitaModel = require('../models/cita.model'); 
const ProductoModel = require('../models/producto.model'); 
const MovimientoModel = require('../models/movimiento.model'); 
const ClienteModel = require('../models/cliente.model'); 
const {
    generarCitasMensuales,
    generarRankingClientes,
    generarTopVentas,
    generarRankingVeterinarios,
    generarTopAnimales, 
    generarAlertasStock,
    generarTopServicios 
} = require('../utils/estadisticas.utils'); 

class EstadisticasFacade {
    
    async obtenerDashboardPrincipal() {
        console.log('[FACADE ESTADISTICAS] Orquestando peticiones de datos de múltiples Models.');
        
        try {
            const [citasRaw, movimientosRaw, clientesRaw] = await Promise.all([
                CitaModel.finAllData(),      
                MovimientoModel.finAllData(),
                ClienteModel.finAllData()
            ]);

            const stockBajoRaw = await ProductoModel.obtenerProductosStockBajo(10); 
            
            const serviciosRaw = await CitaModel.obtenerServiciosMasSolicitados(); 

            const citasMensuales = generarCitasMensuales(citasRaw);
            const rankingClientes = generarRankingClientes(citasRaw);
            const topVentas = generarTopVentas(movimientosRaw); 
            const rankingVeterinarios = generarRankingVeterinarios(citasRaw);
            const topAnimales = generarTopAnimales(citasRaw); 
            const stockBajo = generarAlertasStock(stockBajoRaw); 
            const topServicios = generarTopServicios(serviciosRaw);
            
            return {
                citas_mensuales: citasMensuales, 
                ranking_clientes: rankingClientes, 
                top_ventas: topVentas, 
                ranking_veterinarios: rankingVeterinarios, 
                top_animales: topAnimales,
                stock_bajo: stockBajo,
                top_servicios: topServicios,
                
                fecha_generacion: new Date().toISOString()
            };

        } catch (error) {
            console.error('[FACADE ESTADISTICAS] Error en la orquestación:', error);
            throw new Error("Error interno al generar el Dashboard de estadísticas.");
        }
    }
}

module.exports = new EstadisticasFacade();