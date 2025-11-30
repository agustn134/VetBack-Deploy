// src/models/paciente.model.js
const { pool } = require('../db/config');

const PacienteModel = {
  async create({ cliente_id, nombre, animal_id, raza, edad, peso }) {
    const query = `
      INSERT INTO tPacientes (cliente_id, nombre, animal_id, raza, edad, peso)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [cliente_id, nombre, animal_id || null, raza || null, edad || null, peso || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const query = `
      SELECT p.*, c.nombre_completo AS cliente_nombre
      FROM tPacientes p
      JOIN tClientes c ON p.cliente_id = c.id
      ORDER BY p.created_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async findById(id) {
    const query = `
      SELECT p.*, c.nombre_completo AS cliente_nombre
      FROM tPacientes p
      JOIN tClientes c ON p.cliente_id = c.id
      WHERE p.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByClienteYNombre(cliente_id, nombre) {
    const query = `
      SELECT * 
      FROM tPacientes
      WHERE cliente_id = $1
        AND LOWER(nombre) = LOWER($2)
      LIMIT 1;
    `;
    const result = await pool.query(query, [cliente_id, nombre]);
    return result.rows[0];
  },

  async update(id, data) {
    const query = `
      UPDATE tPacientes
      SET 
        nombre   = $1,
        animal_id = $2,
        raza     = $3,
        edad     = $4,
        peso     = $5
      WHERE id = $6
      RETURNING *;
    `;
    const result = await pool.query(query, [
      data.nombre,
      data.animal_id || null,
      data.raza || null,
      data.edad || null,
      data.peso || null,
      id,
    ]);
    return result.rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM tPacientes WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = PacienteModel;
