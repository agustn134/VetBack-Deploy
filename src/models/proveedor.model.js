const { pool } = require('../db/config');

const ProveedorModel = {
  findAll: async () => {
    const query = 'SELECT * FROM tproveedores ORDER BY nombre ASC;';
    const result = await pool.query(query);
    return result.rows;
  },

  create: async ({ nombre, contacto, telefono, correo, direccion }) => {
    const query = `
      INSERT INTO tproveedores (nombre, contacto, telefono, correo, direccion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nombre, contacto, telefono, correo, direccion];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};

module.exports = ProveedorModel;
