const { pool } = require('../db/config');

const HistorialCambiosModel = {

  async registrar({
    expediente_id,
    consulta_id,
    usuario_id,
    tipo_cambio,
    tabla_afectada,
    descripcion
  }) {
    const query = `
      INSERT INTO tHistorialCambios (
        expediente_id,
        consulta_id,
        usuario_id,
        tipo_cambio,
        tabla_afectada,
        descripcion,
        fecha_cambio
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;

    const values = [
      expediente_id || null,
      consulta_id || null,
      usuario_id || null,
      tipo_cambio,
      tabla_afectada,
      descripcion
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByExpediente(expediente_id) {
    const query = `
      SELECT hc.*, u.nombre_completo AS usuario
      FROM tHistorialCambios hc
      LEFT JOIN tUsuarios u ON hc.usuario_id = u.id
      WHERE expediente_id = $1
      ORDER BY fecha_cambio DESC;
    `;
    const result = await pool.query(query, [expediente_id]);
    return result.rows;
  },

  async findByConsulta(consulta_id) {
    const query = `
      SELECT hc.*, u.nombre_completo AS usuario
      FROM tHistorialCambios hc
      LEFT JOIN tUsuarios u ON hc.usuario_id = u.id
      WHERE consulta_id = $1
      ORDER BY fecha_cambio DESC;
    `;
    const result = await pool.query(query, [consulta_id]);
    return result.rows;
  }
};

module.exports = HistorialCambiosModel;
