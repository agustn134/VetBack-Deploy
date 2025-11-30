const { success, error } = require('../utils/responseHandler');
const servicioFacade = require('../facades/servicio.facade');
const jwt = require('jsonwebtoken'); // [Agregado] Necesario para leer el token manualmente

const getServicios = async (req, res) => {
    try {
        let esAdmin = false;

        // --- LÓGICA DE VERIFICACIÓN OPCIONAL ---
        // Buscamos si viene un token en la cabecera, aunque la ruta sea pública
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            try {
                // Intentamos verificar el token
                // Asegúrate de que process.env.JWT_SECRET esté cargado
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Si es válido, verificamos el rol
                if (decoded.rol === 'Admin') {
                    esAdmin = true;
                }
            } catch (err) {
                // Si el token está expirado o malformado, no hacemos nada (seguimos como usuario público)
                console.log('Token inválido en getServicios (acceso público permitido)');
            }
        }
        // ----------------------------------------

        const servicios = await servicioFacade.obtenerCatalogoServicios(esAdmin);
        success(res, servicios, 'Lista de servicios obtenida');
    } catch (err) {
        console.error(err);
        error(res, 'Error al obtener servicios', 500);
    }
};

const getServicioById = async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await servicioFacade.obtenerServicioPorId(id);
        if (!servicio) {
            return error(res, 'Servicio no encontrado', 404);
        }
        success(res, servicio, 'Servicio obtenido');
    } catch (err) {
        console.error(err);
        error(res, 'Error al obtener el servicio', 500);
    }
};

const createServicio = async (req, res) => {
    try {
        const nuevoServicio = await servicioFacade.registrarNuevoServicio(req.body);
        success(res, nuevoServicio, 'Servicio creado correctamente', 201);
    } catch (err) {
        console.error(err);
        error(res, 'Error creando servicio', 500);
    }
};

const updateServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await servicioFacade.modificarServicio(id, req.body);
        if (!actualizado) {
            return error(res, 'Servicio no encontrado para actualizar', 404);
        }
        success(res, actualizado, 'Servicio actualizado correctamente');
    } catch (err) {
        console.error(err);
        error(res, 'Error actualizando servicio', 500);
    }
};

const deleteServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await servicioFacade.eliminarServicio(id);
        if (!eliminado) {
            return error(res, 'Servicio no encontrado para eliminar', 404);
        }
        success(res, eliminado, 'Servicio eliminado correctamente');
    } catch (err) {
        console.error(err);
        error(res, 'Error eliminando servicio', 500);
    }
};

module.exports = { 
    getServicios, 
    getServicioById, 
    createServicio, 
    updateServicio, 
    deleteServicio 
};