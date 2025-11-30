const { pool } = require('../db/config');

const ExpedienteModel = {
  async create({ paciente_id, observaciones_generales }) {
    const numero_expediente = `EXP-${Date.now()}`;
    const fecha_apertura = new Date().toISOString().split('T')[0];

    const query = `
      INSERT INTO tExpedientes (
        paciente_id,
        numero_expediente,
        fecha_apertura,
        estado,
        observaciones_generales
      )
      VALUES ($1, $2, $3, 'Activo', $4)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      paciente_id,
      numero_expediente,
      fecha_apertura,
      observaciones_generales || null,
    ]);

    return result.rows[0];
  },

  async findAll() {
    const query = `
      SELECT 
        e.*, 
        p.nombre AS paciente_nombre, 
        c.nombre_completo AS cliente_nombre
      FROM tExpedientes e
      JOIN tPacientes p ON e.paciente_id = p.id
      JOIN tClientes c ON p.cliente_id = c.id
      ORDER BY e.created_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async findById(id_expediente) {
    const query = `
      SELECT 
        e.*, 
        p.nombre AS paciente_nombre, 
        c.nombre_completo AS cliente_nombre
      FROM tExpedientes e
      JOIN tPacientes p ON e.paciente_id = p.id
      JOIN tClientes c ON p.cliente_id = c.id
      WHERE e.id_expediente = $1;
    `;
    const result = await pool.query(query, [id_expediente]);
    return result.rows[0];
  },

  async findByPacienteId(paciente_id) {
    const query = `
      SELECT * 
      FROM tExpedientes
      WHERE paciente_id = $1
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const result = await pool.query(query, [paciente_id]);
    return result.rows[0];
  },

  async update(id_expediente, data) {
    const query = `
      UPDATE tExpedientes
      SET 
        observaciones_generales = $1,
        estado = $2,
        updated_at = NOW()
      WHERE id_expediente = $3
      RETURNING *;
    `;
    const result = await pool.query(query, [
      data.observaciones_generales || null,
      data.estado || 'Activo',
      id_expediente,
    ]);
    return result.rows[0];
  },

  async delete(id_expediente) {
    const query = `
      DELETE FROM tExpedientes
      WHERE id_expediente = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id_expediente]);
    return result.rows[0];
  },

  async search(term) {
    const q = `%${term.toLowerCase()}%`;
    const query = `
      SELECT 
        e.*, 
        p.nombre AS paciente_nombre, 
        c.nombre_completo AS cliente_nombre
      FROM tExpedientes e
      JOIN tPacientes p ON e.paciente_id = p.id
      JOIN tClientes c ON p.cliente_id = c.id
      WHERE 
        LOWER(p.nombre) LIKE $1
        OR LOWER(c.nombre_completo) LIKE $1
        OR LOWER(e.numero_expediente) LIKE $1
      ORDER BY e.created_at DESC;
    `;
    const result = await pool.query(query, [q]);
    return result.rows;
  },

async findDetalle(id_expediente) {
  const query = `
    SELECT
      e.id_expediente,
      e.numero_expediente,
      e.fecha_apertura,
      e.estado,
      e.observaciones_generales,
      e.created_at AS expediente_creado,
      e.updated_at AS expediente_actualizado,

      -- Paciente
      json_build_object(
        'id', p.id,
        'nombre', p.nombre,
        'raza', p.raza,
        'edad', p.edad,
        'peso', p.peso,
        'animal_id', p.animal_id,
        'created_at', p.created_at
      ) AS paciente,

      -- Cliente
      json_build_object(
        'id', c.id,
        'nombre_completo', c.nombre_completo,
        'correo', c.correo,
        'telefono', c.telefono,
        'direccion', c.direccion,
        'created_at', c.created_at
      ) AS cliente,


      -- =============================
      --   CONSULTAS COMPLETAS
      -- =============================
      (
        SELECT json_agg(
          json_build_object(
            'consulta', cons,
            'diagnosticos', (
              SELECT json_agg(d)
              FROM tDiagnosticos d
              WHERE d.consulta_id = cons.id_consulta
            ),
            'tratamientos', (
              SELECT json_agg(t)
              FROM tTratamientos t
              WHERE t.consulta_id = cons.id_consulta
            ),
            'vacunas', (
              SELECT json_agg(v)
              FROM tvacunas v
              WHERE v.consulta_id = cons.id_consulta
            ),
            'procedimientos', (
              SELECT json_agg(pr)
              FROM tprocedimientos pr
              WHERE pr.consulta_id = cons.id_consulta
            ),
            'imagenes', (
              SELECT json_agg(i)
              FROM timagenesexpediente i
              WHERE i.consulta_id = cons.id_consulta
            )
          )
        )
        FROM tConsultas cons
        WHERE cons.expediente_id = e.id_expediente
      ) AS consultas,


      -- =============================
      --   HISTORIAL COMPLETO
      -- =============================
      (
        SELECT json_agg(
          json_build_object(
            'id_cambio', h.id_cambio,
            'consulta_id', h.consulta_id,
            'usuario_id', h.usuario_id,
            'tipo_cambio', h.tipo_cambio,
            'tabla_afectada', h.tabla_afectada,
            'descripcion', h.descripcion,
            'fecha_cambio', h.fecha_cambio
          )
        )
        FROM thistorialcambios h
        WHERE h.expediente_id = e.id_expediente
      ) AS historial

    FROM tExpedientes e
      JOIN tPacientes p ON e.paciente_id = p.id
      JOIN tClientes c ON p.cliente_id = c.id
    WHERE e.id_expediente = $1
  `;

  const result = await pool.query(query, [id_expediente]);
  return result.rows[0];
},

async findByPaciente(paciente_id) {
  const query = `
    SELECT *
    FROM tExpedientes
    WHERE paciente_id = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [paciente_id]);
  return result.rows;
},

async findAllByPaciente(paciente_id) {
  const query = `
    SELECT 
      e.id_expediente,
      e.paciente_id,
      e.numero_expediente,
      e.fecha_apertura,
      e.estado,
      e.observaciones_generales,
      e.created_at,
      e.updated_at,
      COUNT(c.id_consulta) as total_consultas,
      MAX(c.fecha_consulta) as ultima_consulta_fecha
    FROM tExpedientes e
    LEFT JOIN tConsultas c ON e.id_expediente = c.expediente_id
    WHERE e.paciente_id = $1
    GROUP BY e.id_expediente
    ORDER BY e.created_at DESC
  `;
  
  const result = await pool.query(query, [paciente_id]);
  return result.rows;
},

/**
 * Obtener expediente COMPLETO con todas sus relaciones
 * Similar a findDetalle pero más enfocado en datos para edición
 */
async findCompleto(id_expediente) {
  const query = `
    SELECT
      e.id_expediente,
      e.numero_expediente,
      e.fecha_apertura,
      e.estado,
      e.observaciones_generales,
      e.created_at AS expediente_creado,
      e.updated_at AS expediente_actualizado,

      -- Paciente
      json_build_object(
        'id', p.id,
        'nombre', p.nombre,
        'raza', p.raza,
        'edad', p.edad,
        'peso', p.peso,
        'animal_id', p.animal_id,
        'created_at', p.created_at
      ) AS paciente,

      -- Cliente
      json_build_object(
        'id', c.id,
        'nombre_completo', c.nombre_completo,
        'correo', c.correo,
        'telefono', c.telefono,
        'direccion', c.direccion
      ) AS cliente,

      -- Última consulta (para pre-llenar formularios)
      (
        SELECT row_to_json(ultima_cons)
        FROM (
          SELECT 
            cons.id_consulta,
            cons.fecha_consulta,
            cons.peso_actual,
            cons.temperatura,
            cons.frecuencia_cardiaca,
            cons.frecuencia_respiratoria,
            cons.motivo_consulta,
            cons.sintomas,
            cons.observaciones
          FROM tConsultas cons
          WHERE cons.expediente_id = e.id_expediente
          ORDER BY cons.fecha_consulta DESC, cons.created_at DESC
          LIMIT 1
        ) ultima_cons
      ) AS ultima_consulta,

      -- Todas las consultas con sus relaciones
      (
        SELECT json_agg(
          json_build_object(
            'id_consulta', consulta_data.id_consulta,
            'fecha_consulta', consulta_data.fecha_consulta,
            'peso_actual', consulta_data.peso_actual,
            'temperatura', consulta_data.temperatura,
            'motivo_consulta', consulta_data.motivo_consulta,
            'diagnosticos', consulta_data.diagnosticos,
            'tratamientos', consulta_data.tratamientos,
            'vacunas', consulta_data.vacunas
          )
        )
        FROM (
          SELECT 
            cons.id_consulta,
            cons.fecha_consulta,
            cons.peso_actual,
            cons.temperatura,
            cons.motivo_consulta,
            (
              SELECT json_agg(d)
              FROM tDiagnosticos d
              WHERE d.consulta_id = cons.id_consulta
            ) as diagnosticos,
            (
              SELECT json_agg(t)
              FROM tTratamientos t
              WHERE t.consulta_id = cons.id_consulta
            ) as tratamientos,
            (
              SELECT json_agg(v)
              FROM tvacunas v
              WHERE v.consulta_id = cons.id_consulta
            ) as vacunas
          FROM tConsultas cons
          WHERE cons.expediente_id = e.id_expediente
          ORDER BY cons.fecha_consulta DESC
        ) consulta_data
      ) AS consultas

    FROM tExpedientes e
    JOIN tPacientes p ON e.paciente_id = p.id
    JOIN tClientes c ON p.cliente_id = c.id
    WHERE e.id_expediente = $1
  `;

  const result = await pool.query(query, [id_expediente]);
  return result.rows[0];
}



};

module.exports = ExpedienteModel;
