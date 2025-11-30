const { pool } = require('../db/config');

const UsuarioModel = {
  async crearUsuario({ nombre_completo, correo, telefono, rol, password_hash }) {
    const query = `
      INSERT INTO tUsuarios (nombre_completo, correo, telefono, rol, password_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nombre_completo, correo, rol, activo;
    `;
    const values = [nombre_completo, correo, telefono, rol, password_hash];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  
  async buscarPorCorreo(correo) {
    const result = await pool.query('SELECT * FROM tUsuarios WHERE correo = $1', [correo]);
    return result.rows[0];
  },
  
  findByRole: async (rol) => {
    const query = `
      SELECT id, nombre_completo, correo, rol
      FROM tUsuarios
      WHERE rol = $1 AND activo = true
      ORDER BY nombre_completo ASC;
    `;
    try {
      const result = await pool.query(query, [rol]);
      return result.rows;
    } catch (error) {
      console.error(`[MODELO USUARIO] Error al buscar por rol ${rol}:`, error);
      throw error;
    }
  },

  getVeterinarios: async () => {
    return await UsuarioModel.findByRole('Veterinario');
  },

  getAuxiliares: async () => {
    return await UsuarioModel.findByRole('Auxiliar');
  }
  
};

module.exports = UsuarioModel;