// const { pool } = require('../db/config');

// const TratamientoModel = {

//   async create({
//     consulta_id,
//     medicamento,
//     dosis,
//     frecuencia,
//     duracion_dias,
//     via_administracion,
//     indicaciones,
//     fecha_inicio,
//     fecha_fin
//   }) {
//     const query = `
//       INSERT INTO tTratamientos (
//         consulta_id,
//         medicamento,
//         dosis,
//         frecuencia,
//         duracion_dias,
//         via_administracion,
//         indicaciones,
//         fecha_inicio,
//         fecha_fin,
//         created_at
//       )
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
//       RETURNING *;
//     `;

//     const values = [
//       consulta_id,
//       medicamento,
//       dosis,
//       frecuencia,
//       duracion_dias,
//       via_administracion,
//       indicaciones,
//       fecha_inicio,
//       fecha_fin
//     ];

//     const result = await pool.query(query, values);
//     return result.rows[0];
//   },

//   async findById(id) {
//     const result = await pool.query(
//       `SELECT * FROM tTratamientos WHERE id_tratamiento = $1`,
//       [id]
//     );
//     return result.rows[0];
//   },

//   async findByConsulta(consulta_id) {
//     const result = await pool.query(
//       `SELECT * FROM tTratamientos WHERE consulta_id = $1 ORDER BY created_at DESC`,
//       [consulta_id]
//     );
//     return result.rows;
//   },

//   async update(id, data) {
//     const query = `
//       UPDATE tTratamientos
//       SET medicamento = $1,
//           dosis = $2,
//           frecuencia = $3,
//           duracion_dias = $4,
//           via_administracion = $5,
//           indicaciones = $6,
//           fecha_inicio = $7,
//           fecha_fin = $8
//       WHERE id_tratamiento = $9
//       RETURNING *;
//     `;

//     const values = [
//       data.medicamento,
//       data.dosis,
//       data.frecuencia,
//       data.duracion_dias,
//       data.via_administracion,
//       data.indicaciones,
//       data.fecha_inicio,
//       data.fecha_fin,
//       id
//     ];

//     const result = await pool.query(query, values);
//     return result.rows[0];
//   },

//   async delete(id) {
//     const result = await pool.query(
//       `DELETE FROM tTratamientos WHERE id_tratamiento = $1 RETURNING *`,
//       [id]
//     );
//     return result.rows[0];
//   }
// };

// module.exports = TratamientoModel;




const { pool } = require('../db/config');

const TratamientoModel = {

  // MODIFICADO: Agregamos producto_id
  async create({
    consulta_id,
    medicamento,
    dosis,
    frecuencia,
    duracion_dias,
    via_administracion,
    indicaciones,
    fecha_inicio,
    fecha_fin,
    producto_id // <--- Nuevo parámetro
  }) {
    const query = `
      INSERT INTO tTratamientos (
        consulta_id,
        medicamento,
        dosis,
        frecuencia,
        duracion_dias,
        via_administracion,
        indicaciones,
        fecha_inicio,
        fecha_fin,
        producto_id, -- <--- 1. Columna nueva
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) -- <--- 2. Agregamos $10
      RETURNING *;
    `;

    // 3. Agregamos valor al array
    const values = [
      consulta_id,
      medicamento,
      dosis,
      frecuencia,
      duracion_dias,
      via_administracion,
      indicaciones,
      fecha_inicio,
      fecha_fin,
      producto_id || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM tTratamientos WHERE id_tratamiento = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findByConsulta(consulta_id) {
    const result = await pool.query(
      `SELECT * FROM tTratamientos WHERE consulta_id = $1 ORDER BY created_at DESC`,
      [consulta_id]
    );
    return result.rows;
  },

  async update(id, data) {
    const query = `
      UPDATE tTratamientos
      SET medicamento = $1,
          dosis = $2,
          frecuencia = $3,
          duracion_dias = $4,
          via_administracion = $5,
          indicaciones = $6,
          fecha_inicio = $7,
          fecha_fin = $8
      WHERE id_tratamiento = $9
      RETURNING *;
    `;

    const values = [
      data.medicamento,
      data.dosis,
      data.frecuencia,
      data.duracion_dias,
      data.via_administracion,
      data.indicaciones,
      data.fecha_inicio,
      data.fecha_fin,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM tTratamientos WHERE id_tratamiento = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

module.exports = TratamientoModel;
