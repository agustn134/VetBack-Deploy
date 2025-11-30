const { pool } = require('../db/config');
const responseHandler = require('../utils/responseHandler');
const UsuarioModel = require('../models/usuario.model'); 


const UsuarioController = {
  getUsuarioById: async (req, res) => {
    const { id } = req.params;

    try {
      const query = `
        SELECT id, nombre_completo
        FROM tUsuarios
        WHERE id = $1;
      `;
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return responseHandler.error(res, 'Usuario no encontrado', 404);
      }

      return responseHandler.success(res, result.rows[0], 'Usuario encontrado');
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return responseHandler.error(res, 'Error interno al obtener el usuario');
    }
  },
  /**
   * Obtiene todos los usuarios con rol 'Veterinario'
   */
  getVeterinarios: async (req, res) => {
    try {
      // ¡ARREGLO! Ahora llama a la función correcta del modelo
      const veterinarios = await UsuarioModel.findByRole('Veterinario'); 
      return responseHandler.success(
        res,
        veterinarios,
        `Se encontraron ${veterinarios.length} veterinarios.`
      );
    } catch (error) {
      console.error("[CONTROLADOR USUARIO] Error al obtener veterinarios:", error);
      return responseHandler.error(res, 'Error interno al obtener veterinarios.');
    }
  }


};

module.exports = UsuarioController;
