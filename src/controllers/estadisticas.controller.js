const EstadisticasFacade = require('../facades/estadisticas.facade');
const responseHandler = require('../utils/responseHandler'); 

const getDashboardData = async (req, res) => {
    console.log('[CONTROLADOR ESTADISTICAS] Solicitud para obtener Dashboard (usando Facade).');
    
    try {
        const dataDashboard = await EstadisticasFacade.obtenerDashboardPrincipal();
        
        return responseHandler.success(res, dataDashboard, 'Dashboard de estadísticas generado con éxito.', 200);
    } catch (error) {
        console.error("[CONTROLADOR ESTADISTICAS] Error al obtener dashboard:", error);
        return responseHandler.error(res, error.message, 500);
    }
};

module.exports = {
    getDashboardData
};