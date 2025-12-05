const { pool } = require('../db/config');

const MovimientoModel = {
  create: async ({ tipo, producto_id, lote_id, cantidad, motivo, usuario_id }) => {
    const query = `
      INSERT INTO tMovimientos (tipo, producto_id, lote_id, cantidad, motivo, usuario_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [tipo, producto_id, lote_id, cantidad, motivo, usuario_id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      throw error;
    }
  },

  findAll: async () => {
    const query = `
      SELECT m.*, 
             p.nombre AS producto_nombre,
             l.num_lote,
             u.nombre_completo AS usuario_nombre
      FROM tMovimientos m
      LEFT JOIN tProductos p ON m.producto_id = p.id
      LEFT JOIN tLotes l ON m.lote_id = l.id
      LEFT JOIN tUsuarios u ON m.usuario_id = u.id
      ORDER BY m.fecha DESC;
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      throw error;
    }
  },

  findById: async (id) => {
    const query = `
      SELECT m.*, 
             p.nombre AS producto_nombre,
             l.num_lote,
             u.nombre_completo AS usuario_nombre
      FROM tMovimientos m
      LEFT JOIN tProductos p ON m.producto_id = p.id
      LEFT JOIN tLotes l ON m.lote_id = l.id
      LEFT JOIN tUsuarios u ON m.usuario_id = u.id
      WHERE m.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  finAllData: async () => {
    const query = `
            SELECT m.*, 
                   p.nombre AS producto_nombre,
                   l.num_lote,
                   u.nombre_completo AS usuario_nombre
            FROM tMovimientos m
            LEFT JOIN tProductos p ON m.producto_id = p.id
            LEFT JOIN tLotes l ON m.lote_id = l.id
            LEFT JOIN tUsuarios u ON m.usuario_id = u.id
            ORDER BY m.fecha DESC;
        `;

    try {
      const result = await pool.query(query);
      console.log(`[MODELO MOVIMIENTO] Se encontraron ${result.rows.length} movimientos`);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      throw error;
    }
  },
};

module.exports = MovimientoModel;
