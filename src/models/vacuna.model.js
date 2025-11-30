// const { pool } = require('../db/config');

// const VacunaModel = {

//   async create({ consulta_id, nombre_vacuna, fecha_aplicacion, proxima_dosis, sitio_aplicacion, reacciones_adversas }) {
//     const query = `
//       INSERT INTO tVacunas (
//         consulta_id,
//         nombre_vacuna,
//         fecha_aplicacion,
//         proxima_dosis,
//         sitio_aplicacion,
//         reacciones_adversas,
//         created_at,
        
//       )
//       VALUES ($1, $2, $3, $4, $5, $6, NOW())
//       RETURNING *;
//     `;

//     const values = [
//       consulta_id,
//       nombre_vacuna,
//       fecha_aplicacion,
//       proxima_dosis,
//       sitio_aplicacion,
//       reacciones_adversas
//     ];

//     const result = await pool.query(query, values);
//     return result.rows[0];
//   },

//   async findById(id) {
//     const result = await pool.query(
//       `SELECT * FROM tVacunas WHERE id_vacuna = $1`,
//       [id]
//     );
//     return result.rows[0];
//   },

//   async findByConsulta(consulta_id) {
//     const result = await pool.query(
//       `SELECT * FROM tVacunas WHERE consulta_id = $1 ORDER BY fecha_aplicacion DESC`,
//       [consulta_id]
//     );
//     return result.rows;
//   },

//   async update(id, data) {
//     const query = `
//       UPDATE tVacunas
//       SET nombre_vacuna = $1,
//           fecha_aplicacion = $2,
//           proxima_dosis = $3,
//           sitio_aplicacion = $4,
//           reacciones_adversas = $5
//       WHERE id_vacuna = $6
//       RETURNING *;
//     `;

//     const values = [
//       data.nombre_vacuna,
//       data.fecha_aplicacion,
//       data.proxima_dosis,
//       data.sitio_aplicacion,
//       data.reacciones_adversas,
//       id
//     ];

//     const result = await pool.query(query, values);
//     return result.rows[0];
//   },

//   async delete(id) {
//     const result = await pool.query(
//       `DELETE FROM tVacunas WHERE id_vacuna = $1 RETURNING *`,
//       [id]
//     );
//     return result.rows[0];
//   }
// };

// module.exports = VacunaModel;

const { pool } = require('../db/config');

const VacunaModel = {

  // MODIFICADO: Agregamos producto_id en los argumentos
  async create({ consulta_id, nombre_vacuna, fecha_aplicacion, proxima_dosis, sitio_aplicacion, reacciones_adversas, producto_id }) {
    const query = `
      INSERT INTO tVacunas (
        consulta_id,
        nombre_vacuna,
        fecha_aplicacion,
        proxima_dosis,
        sitio_aplicacion,
        reacciones_adversas,
        producto_id,  -- <--- 1. Columna nueva
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) -- <--- 2. Agregamos $7
      RETURNING *;
    `;

    // 3. Agregamos el valor al array (puede ser null si no gastan inventario)
    const values = [
      consulta_id,
      nombre_vacuna,
      fecha_aplicacion,
      proxima_dosis,
      sitio_aplicacion,
      reacciones_adversas,
      producto_id || null 
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM tVacunas WHERE id_vacuna = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findByConsulta(consulta_id) {
    const result = await pool.query(
      `SELECT * FROM tVacunas WHERE consulta_id = $1 ORDER BY fecha_aplicacion DESC`,
      [consulta_id]
    );
    return result.rows;
  },

  async update(id, data) {
    const query = `
      UPDATE tVacunas
      SET nombre_vacuna = $1,
          fecha_aplicacion = $2,
          proxima_dosis = $3,
          sitio_aplicacion = $4,
          reacciones_adversas = $5
      WHERE id_vacuna = $6
      RETURNING *;
    `;

    const values = [
      data.nombre_vacuna,
      data.fecha_aplicacion,
      data.proxima_dosis,
      data.sitio_aplicacion,
      data.reacciones_adversas,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM tVacunas WHERE id_vacuna = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

module.exports = VacunaModel;
