const servicioModel = require('../models/servicio.model');

class ServicioFacade {
    
    async obtenerCatalogoServicios(esAdmin) {
        // Si NO es admin, solo mostramos los activos.
        // Si ES admin, mostramos todos (activos e inactivos) para que pueda editar.
        const soloActivos = !esAdmin;
        return await servicioModel.getServices(soloActivos);
    }

    async obtenerServicioPorId(id) {
        return await servicioModel.getServiceById(id);
    }

    async registrarNuevoServicio(data) {
        // Aquí podrías validar que el título no esté vacío, etc.
        // Como no subimos archivos, la imagen_url viene directa del body
        const servicioData = {
            ...data,
            activo: data.activo === true || data.activo === 'true' // Asegurar booleano
        };
        return await servicioModel.createService(servicioData);
    }

    async modificarServicio(id, data) {
        return await servicioModel.updateService(id, data);
    }

    async eliminarServicio(id) {
        return await servicioModel.deleteService(id);
    }
}

module.exports = new ServicioFacade();