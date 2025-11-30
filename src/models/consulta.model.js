const { pool } = require('../db/config');

const ConsultaModel = {

  async create({
    expediente_id,
    veterinario_id,
    peso_actual,
    temperatura,
    frecuencia_cardiaca,
    frecuencia_respiratoria,
    motivo_consulta,
    sintomas,
    observaciones
  }) {
    const query = `
      INSERT INTO tConsultas (
        expediente_id,
        veterinario_id,
        fecha_consulta,
        peso_actual,
        temperatura,
        frecuencia_cardiaca,
        frecuencia_respiratoria,
        motivo_consulta,
        sintomas,
        observaciones
      )
      VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      expediente_id,
      veterinario_id,
      peso_actual,
      temperatura,
      frecuencia_cardiaca,
      frecuencia_respiratoria,
      motivo_consulta,
      sintomas,
      observaciones
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(id) {
    const query = `SELECT * FROM tConsultas WHERE id_consulta = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByExpediente(expediente_id) {
    const query = `
      SELECT *
      FROM tConsultas
      WHERE expediente_id = $1
      ORDER BY fecha_consulta DESC;
    `;
    const result = await pool.query(query, [expediente_id]);
    return result.rows;
  },

    async update(id_consulta, datos) {
    console.log(`[MODELO CONSULTA] Actualizando consulta ID: ${id_consulta}`);

    const actual = await pool.query(
        `SELECT * FROM tConsultas WHERE id_consulta = $1`,
        [id_consulta]
    );

    if (actual.rows.length === 0) {
        throw new Error("Consulta no encontrada");
    }

    const anterior = actual.rows[0];

    const nuevo = {
        peso_actual: datos.peso_actual ?? anterior.peso_actual,
        temperatura: datos.temperatura ?? anterior.temperatura,
        frecuencia_cardiaca: datos.frecuencia_cardiaca ?? anterior.frecuencia_cardiaca,
        frecuencia_respiratoria: datos.frecuencia_respiratoria ?? anterior.frecuencia_respiratoria,
        motivo_consulta: datos.motivo_consulta ?? anterior.motivo_consulta,
        sintomas: datos.sintomas ?? anterior.sintomas,
        observaciones: datos.observaciones ?? anterior.observaciones
    };

    const query = `
        UPDATE tConsultas
        SET peso_actual = $1,
            temperatura = $2,
            frecuencia_cardiaca = $3,
            frecuencia_respiratoria = $4,
            motivo_consulta = $5,
            sintomas = $6,
            observaciones = $7,
            updated_at = NOW()
        WHERE id_consulta = $8
        RETURNING *;
    `;

    const result = await pool.query(query, [
        nuevo.peso_actual,
        nuevo.temperatura,
        nuevo.frecuencia_cardiaca,
        nuevo.frecuencia_respiratoria,
        nuevo.motivo_consulta,
        nuevo.sintomas,
        nuevo.observaciones,
        id_consulta
    ]);

    return result.rows[0];
    },

  async delete(id) {
    const query = `
      DELETE FROM tConsultas
      WHERE id_consulta = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = ConsultaModel;
