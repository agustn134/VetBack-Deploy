const { pool } = require('../db/config');

const ImagenModel = {

  async create({
    consulta_id,
    imagen_base64,
    descripcion,
    tipo_imagen
  }) {
    const query = `
      INSERT INTO tImagenesExpediente (
        consulta_id,
        imagen_base64,
        descripcion,
        tipo_imagen,
        fecha_subida
      )
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;

    const values = [
      consulta_id,
      imagen_base64,
      descripcion,
      tipo_imagen
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM tImagenesExpediente WHERE id_imagen = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findByConsulta(consulta_id) {
    const result = await pool.query(
      `SELECT * FROM tImagenesExpediente WHERE consulta_id = $1 ORDER BY fecha_subida DESC`,
      [consulta_id]
    );
    return result.rows;
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM tImagenesExpediente WHERE id_imagen = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  async update(id, datos) {
    try {
      const campos = [];
      const valores = [];
      let contador = 1;

      if (datos.descripcion !== undefined) {
        campos.push(`descripcion = $${contador++}`);
        valores.push(datos.descripcion);
      }

      if (datos.tipo_imagen !== undefined) {
        campos.push(`tipo_imagen = $${contador++}`);
        valores.push(datos.tipo_imagen);
      }

      if (datos.imagen_base64 !== undefined) {
        campos.push(`imagen_base64 = $${contador++}`);
        valores.push(datos.imagen_base64);
      }

      if (datos.fecha_subida !== undefined) {
        campos.push(`fecha_subida = $${contador++}`);
        valores.push(datos.fecha_subida);
      }

      if (campos.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      valores.push(id);

      const query = `
        UPDATE tImagenesExpediente
        SET ${campos.join(', ')}
        WHERE id_imagen = $${contador}
        RETURNING *
      `;

      const result = await pool.query(query, valores);

      return result.rows[0];

    } catch (error) {
      console.error('eror en ImagenModel.update:', error);
      throw error;
    }
  }

};

module.exports = ImagenModel;