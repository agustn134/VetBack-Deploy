const { pool } = require('../db/config');

const DiagnosticoModel = {

  async create({ consulta_id, descripcion, tipo }) {
    const query = `
      INSERT INTO tDiagnosticos (consulta_id, descripcion, tipo, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;

    const result = await pool.query(query, [
      consulta_id,
      descripcion,
      tipo || 'Primario'
    ]);

    return result.rows[0];
  },

  async findById(id) {
    const query = `
      SELECT *
      FROM tDiagnosticos
      WHERE id_diagnostico = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByConsulta(consulta_id) {
    const query = `
      SELECT *
      FROM tDiagnosticos
      WHERE consulta_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [consulta_id]);
    return result.rows;
  },

  async update(id, { descripcion, tipo }) {
    const query = `
      UPDATE tDiagnosticos
      SET descripcion = $1,
          tipo = $2
      WHERE id_diagnostico = $3
      RETURNING *;
    `;
    const result = await pool.query(query, [descripcion, tipo, id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = `
      DELETE FROM tDiagnosticos
      WHERE id_diagnostico = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = DiagnosticoModel;
