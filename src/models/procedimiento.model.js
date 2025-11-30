const { pool } = require('../db/config');

const ProcedimientoModel = {

  async create({
    consulta_id,
    tipo_procedimiento,
    nombre_procedimiento,
    descripcion,
    fecha_realizacion,
    hora_inicio,
    hora_fin,
    anestesia_utilizada,
    complicaciones,
    observaciones
  }) {
    const query = `
      INSERT INTO tProcedimientos (
        consulta_id,
        tipo_procedimiento,
        nombre_procedimiento,
        descripcion,
        fecha_realizacion,
        hora_inicio,
        hora_fin,
        anestesia_utilizada,
        complicaciones,
        observaciones,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
      RETURNING *;
    `;

    const values = [
      consulta_id,
      tipo_procedimiento,
      nombre_procedimiento,
      descripcion,
      fecha_realizacion,
      hora_inicio,
      hora_fin,
      anestesia_utilizada,
      complicaciones,
      observaciones
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM tProcedimientos WHERE id_procedimiento = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findByConsulta(consulta_id) {
    const result = await pool.query(
      `SELECT * FROM tProcedimientos WHERE consulta_id = $1 ORDER BY created_at DESC`,
      [consulta_id]
    );
    return result.rows;
  },

  async update(id, data) {
    const query = `
      UPDATE tProcedimientos
      SET tipo_procedimiento = $1,
          nombre_procedimiento = $2,
          descripcion = $3,
          fecha_realizacion = $4,
          hora_inicio = $5,
          hora_fin = $6,
          anestesia_utilizada = $7,
          complicaciones = $8,
          observaciones = $9
      WHERE id_procedimiento = $10
      RETURNING *;
    `;

    const values = [
      data.tipo_procedimiento,
      data.nombre_procedimiento,
      data.descripcion,
      data.fecha_realizacion,
      data.hora_inicio,
      data.hora_fin,
      data.anestesia_utilizada,
      data.complicaciones,
      data.observaciones,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM tProcedimientos WHERE id_procedimiento = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

module.exports = ProcedimientoModel;
