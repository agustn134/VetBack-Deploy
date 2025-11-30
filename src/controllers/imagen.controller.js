const ImagenModel = require('../models/imagen.model');
const responseHandler = require('../utils/responseHandler');

const ImagenController = {
  async subirImagen(req, res) {
    try {
      const { consulta_id, imagenes } = req.body;

      if (!consulta_id)
        return responseHandler.error(res, 'consulta_id es obligatorio.', 400);

      if (!imagenes || !Array.isArray(imagenes) || imagenes.length === 0)
        return responseHandler.error(res, 'Debe enviar al menos una imagen en "imagenes".', 400);

      const resultados = [];

      for (const img of imagenes) {
        const base64 = img.imagen_base64 || img.url_imagen;

        if (!base64)
          return responseHandler.error(res, 'imagen_base64 es obligatoria para cada imagen.', 400);

        const creada = await ImagenModel.create({
          consulta_id,
          imagen_base64: base64,
          descripcion: img.descripcion || null,
          tipo_imagen: img.tipo_imagen || 'Fotografía'
        });

        resultados.push(creada);
      }

      return responseHandler.success(
        res,
        resultados,
        `${resultados.length} imagen(es) registradas correctamente.`,
        201
      );

    } catch (error) {
      console.error('[IMAGEN] Error:', error);
      return responseHandler.error(res, 'Error al registrar imágenes.', 500);
    }
  },

  async obtenerImagen(req, res) {
    try {
      const imagen = await ImagenModel.findById(req.params.id);

      if (!imagen)
        return responseHandler.error(res, 'Imagen no encontrada.', 404);

      return responseHandler.success(res, imagen, 'Imagen encontrada.');
    } catch (error) {
      return responseHandler.error(res, 'Error al obtener imagen.', 500);
    }
  },

  async obtenerPorConsulta(req, res) {
    try {
      const imagenes = await ImagenModel.findByConsulta(req.params.consulta_id);

      return responseHandler.success(
        res,
        imagenes,
        `Total: ${imagenes.length} imagen(es)`
      );
    } catch (error) {
      return responseHandler.error(res, 'Error al listar imágenes.', 500);
    }
  },

  async eliminarImagen(req, res) {
    try {
      const imagen = await ImagenModel.delete(req.params.id);

      if (!imagen)
        return responseHandler.error(res, 'Imagen no encontrada.', 404);

      return responseHandler.success(res, imagen, 'Imagen eliminada correctamente.');
    } catch (error) {
      return responseHandler.error(res, 'Error al eliminar imagen.', 500);
    }
  },

  async actualizarImagen(req, res) {
    try {
      const { id } = req.params;
      const { descripcion, tipo_imagen, imagen_base64 } = req.body;

      const datosActualizacion = {};

      if (descripcion !== undefined) {
        datosActualizacion.descripcion = descripcion;
      }

      if (tipo_imagen !== undefined) {
        datosActualizacion.tipo_imagen = tipo_imagen;
      }

      if (imagen_base64 !== undefined) {
        datosActualizacion.imagen_base64 = imagen_base64;
      }

      if (Object.keys(datosActualizacion).length === 0) {
        return responseHandler.error(res, 'No se proporcionaron campos para actualizar.', 400);
      }

      datosActualizacion.fecha_subida = new Date();

      const imagenActualizada = await ImagenModel.update(id, datosActualizacion);

      if (!imagenActualizada) {
        return responseHandler.error(res, 'Imagen no encontrada.', 404);
      }


      return responseHandler.success(
        res,
        imagenActualizada,
        'Imagen actualizada correctamente.',
        200
      );

    } catch (error) {
      console.error('error al actualizar imagen:', error);
      return responseHandler.error(res, 'Error al actualizar imagen.', 500);
    }
  }
};

module.exports = ImagenController;