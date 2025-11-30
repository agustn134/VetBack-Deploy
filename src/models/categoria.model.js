const { pool } = require('../db/config');

const CategoriaModel = {
  findAll: async () => {
    const query = `SELECT * FROM tcategoriaproductos ORDER BY nombre ASC;`;
    const result = await pool.query(query);
    return result.rows;
  },

  findById: async (id) => {
    const query = `SELECT * FROM tcategoriaproductos WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  create: async ({ nombre }) => {
    const query = `
      INSERT INTO tcategoriaproductos (nombre)
      VALUES ($1)
      RETURNING *;
    `;
    const result = await pool.query(query, [nombre]);
    return result.rows[0];
  }
};

module.exports = CategoriaModel;
