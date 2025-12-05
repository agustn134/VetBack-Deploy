const { pool } = require('../db/config');

const CitaModel = {
    // RQF01 - VALIDACIÓN: Verifica si un veterinario ya tiene una cita en la misma fecha y hora.
    checkAvailability: async (fecha_cita, hora_cita, veterinarioId) => {
        const query = `
            SELECT * FROM tCitas 
            WHERE fecha_cita = $1 
              AND hora_cita = $2 
              AND veterinario_id = $3
              /* Se consideran ocupados los estados Pendiente, Confirmada y Por Confirmar */
              AND estado IN ('Pendiente', 'Confirmada', 'Por Confirmar'); 
        `;
        const values = [fecha_cita, hora_cita, veterinarioId];

        try {
            const result = await pool.query(query, values);
            return result.rows.length > 0; 
        } catch (error) {
            console.error("[MODELO CITA] Error al verificar disponibilidad:", error);
            throw error;
        }
    },

    // RQF01 - ALCANCE: Permite registrar citas.
    // MODIFICADO: Agregado token_confirmacion y estado inicial 'Por Confirmar'
    // create: async ({ cliente_id, mascota_id, veterinario_id, fecha_cita, hora_cita, motivo, animal_id, token_confirmacion, estado = 'Por Confirmar', servicio_id }) => {
    //     const query = `
    //         INSERT INTO tCitas (cliente_id, mascota_id, veterinario_id, animal_id, fecha_cita, hora_cita, motivo, estado, token_confirmacion, servicio_id )
    //         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    //         RETURNING *;
    //     `;
    //     // Nota: Asegúrate de que token_confirmacion siempre se envíe desde el controlador
    //     const values = [cliente_id, mascota_id, veterinario_id, animal_id, fecha_cita, hora_cita, motivo, estado, token_confirmacion, servicio_id || null];

    //     try {
    //         const result = await pool.query(query, values);
    //         return result.rows[0]; 
    //     } catch (error) {
    //         console.error("[MODELO CITA] Error al registrar la cita:", error);
    //         if (error.code === '23503') {
    //             throw new Error("Violación de clave foránea: El cliente, mascota, veterinario o tipo de animal no existe.");
    //         }
    //         throw error;
    //     }
    // },

    // MODIFICADO: Ahora soporta múltiples servicios (Array)
    create: async ({ cliente_id, mascota_id, veterinario_id, fecha_cita, hora_cita, motivo, animal_id, token_confirmacion, estado = 'Por Confirmar', servicios = [] }) => {
        const client = await pool.connect(); // Usamos cliente para transacción
        
        try {
            await client.query('BEGIN'); // Iniciar transacción

            // 1. Insertar la Cita (Sin servicio_id)
            const queryCita = `
                INSERT INTO tCitas (
                    cliente_id, mascota_id, veterinario_id, animal_id, 
                    fecha_cita, hora_cita, motivo, estado, token_confirmacion
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *;
            `;
            const valuesCita = [cliente_id, mascota_id, veterinario_id, animal_id, fecha_cita, hora_cita, motivo, estado, token_confirmacion];
            const resultCita = await client.query(queryCita, valuesCita);
            const nuevaCita = resultCita.rows[0];

            // 2. Insertar los Servicios (Si el array trae datos)
            if (servicios && servicios.length > 0) {
                // Generamos los valores múltiples: ($1, $2), ($1, $3)...
                // cita_id es constante ($1), servicio_id cambia
                for (const servicioId of servicios) {
                    await client.query(
                        'INSERT INTO tcitas_servicios (cita_id, servicio_id) VALUES ($1, $2)',
                        [nuevaCita.id_cita, servicioId]
                    );
                }
            }

            await client.query('COMMIT'); // Confirmar cambios
            return nuevaCita;

        } catch (error) {
            await client.query('ROLLBACK'); // Si falla, deshacer todo
            console.error("[MODELO CITA] Error al registrar la cita y servicios:", error);
            if (error.code === '23503') {
                throw new Error("Violación de clave foránea: Datos inválidos.");
            }
            throw error;
        } finally {
            client.release(); // Liberar cliente
        }
    },



    // RQF01 - ALCANCE: Permite consultar citas programadas (Agenda).
    findAll: async () => {
        const query = `
            SELECT 
                c.id_cita, 
                c.fecha_cita, 
                c.hora_cita, 
                c.cliente_id, 
                c.mascota_id, 
                c.veterinario_id, 
                c.animal_id, 
                c.motivo, 
                c.estado, 
                c.created_at, 
                c.token_confirmacion,
                cl.nombre_completo AS cliente_nombre,
                cl.correo AS cliente_correo,
                COALESCE(p.nombre, 'Mascota Nueva') AS mascota_nombre
            FROM tCitas c
            JOIN tClientes cl ON c.cliente_id = cl.id
            LEFT JOIN tPacientes p ON c.mascota_id = p.id
            ORDER BY c.fecha_cita ASC, c.hora_cita ASC;
        `;
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("[MODELO CITA] Error al obtener todas las citas:", error);
            throw error;
        }
    },


    // RQF01 - Obtener una cita por ID
    findById: async (idCita) => {
        console.log(`[MODELO CITA] Buscando cita ID: ${idCita}`);
        
        // Se incluye token_confirmacion en el SELECT
        const query = 'SELECT id_cita, fecha_cita, hora_cita, cliente_id, mascota_id, veterinario_id, animal_id, motivo, estado, created_at, token_confirmacion FROM tCitas WHERE id_cita = $1;';
        
        try {
            const result = await pool.query(query, [idCita]);
            
            if (result.rows.length === 0) {
                console.log('[MODELO CITA] Cita no encontrada');
                return null;
            }
            
            console.log('[MODELO CITA] Cita encontrada');
            return result.rows[0];
        } catch (error) {
            console.error('[MODELO CITA] Error al buscar cita:', error.message);
            throw error;
        }
    },
    
    // RQF02 - NUEVA FUNCIÓN: Confirma la cita por token
    confirmByToken: async (token) => {
        console.log(`[MODELO CITA] Buscando cita por token para confirmar...`);
        
        const updateQuery = `
            UPDATE tCitas 
            SET estado = 'Confirmada',
                token_confirmacion = NULL  /* Eliminar token después de usar */
            WHERE token_confirmacion = $1 AND estado = 'Por Confirmar'
            RETURNING *;
        `;
        
        try {
            const result = await pool.query(updateQuery, [token]);
            
            if (result.rows.length === 0) {
                console.log('[MODELO CITA] Token no encontrado o cita ya confirmada/cancelada');
                return null;
            }
            
            console.log('[MODELO CITA] Cita confirmada exitosamente por token');
            return result.rows[0];
        } catch (error) {
            console.error('[MODELO CITA] Error al confirmar cita por token:', error.message);
            throw error;
        }
    },

    // RQF01 - Actualizar/Reprogramar una cita existente
    update: async (idCita, datos) => {
        console.log(`[MODELO CITA] Actualizando cita ID: ${idCita}`);
        console.log('[MODELO CITA] Nuevos datos:', datos);
        
        const query = `
            UPDATE tCitas 
            SET fecha_cita = $1, 
                hora_cita = $2, 
                veterinario_id = $3,
                estado = $4
            WHERE id_cita = $5
            RETURNING *;
        `;
        
        const values = [
            datos.fecha_cita,
            datos.hora_cita,
            datos.veterinario_id || 1,
            datos.estado || 'Pendiente', 
            idCita
        ];
        
        try {
            const result = await pool.query(query, values);
            
            if (result.rows.length === 0) {
                throw new Error('Cita no encontrada');
            }
            
            console.log('[MODELO CITA] Cita actualizada exitosamente');
            return result.rows[0];
        } catch (error) {
            console.error('[MODELO CITA] Error al actualizar cita:', error.message);
            throw error;
        }
    },

    // RQF01 - Cancelar una cita (cambiar estado a 'Cancelada')
    cancel: async (idCita) => {
        console.log(`[MODELO CITA] Cancelando cita ID: ${idCita}`);
        
        const query = `
            UPDATE tCitas 
            SET estado = 'Cancelada'
            WHERE id_cita = $1
            RETURNING *;
        `;
        
        try {
            const result = await pool.query(query, [idCita]);
            
            if (result.rows.length === 0) {
                throw new Error('Cita no encontrada');
            }
            
            console.log('[MODELO CITA] Cita cancelada exitosamente');
            return result.rows[0];
        } catch (error) {
            console.error('[MODELO CITA] Error al cancelar cita:', error.message);
            throw error;
        }
    },

//     async findByVeterinario(veterinarioId) {
//         const query = `
// SELECT 
//     c.id_cita,
//     c.cliente_id,
//     c.mascota_id,
//     c.veterinario_id,
//     c.animal_id,
//     c.fecha_cita,
//     c.hora_cita,
//     c.motivo,
//     c.estado,
//     c.created_at,
//     c.token_confirmacion,
//     cl.nombre_completo AS cliente_nombre,
//     p.nombre AS mascota_nombre,
//     a.nombre AS animal_nombre
// FROM tcitas c
// JOIN tclientes cl ON c.cliente_id = cl.id
// LEFT JOIN tpacientes p ON c.mascota_id = p.id
// JOIN tanimales a ON c.animal_id = a.id_tipoanimal
// WHERE c.veterinario_id = $1
// ORDER BY c.fecha_cita, c.hora_cita;

//         `;
//         const result = await pool.query(query, [veterinarioId]);
//         return result.rows;
//     }

    // NUEVO: Actualizar solo el estado de la cita
    updateStatus: async (idCita, nuevoEstado) => {
        const query = `
            UPDATE tCitas 
            SET estado = $1
            WHERE id_cita = $2
            RETURNING *;
        `;
        try {
            const result = await pool.query(query, [nuevoEstado, idCita]);
            return result.rows[0];
        } catch (error) {
            console.error('[MODELO CITA] Error al actualizar estado:', error);
            throw error;
        }
    },


async findByVeterinario(veterinarioId) {
        const query = `
            SELECT 
                c.id_cita,
                c.cliente_id,
                c.mascota_id,
                c.veterinario_id,
                c.animal_id,
                c.fecha_cita,
                c.hora_cita,
                c.motivo,
                c.estado,
                c.created_at,
                c.token_confirmacion,
                cl.nombre_completo AS cliente_nombre,
                cl.telefono AS cliente_telefono, -- Agregamos teléfono por si necesita llamar
                p.nombre AS mascota_nombre,
                p.raza AS mascota_raza,
                a.nombre AS animal_nombre,
                
                -- SUBCONSULTA: Traer los servicios asociados como un array JSON
(
                    SELECT COALESCE(json_agg(json_build_object(
                        'id', s.id,
                        'titulo', s.titulo,
                        'precio', s.precio,
                        'imagen_url', s.imagen_url,
                        'estado', ts.estado -- <--- ¡NUEVO CAMPO!
                    )), '[]'::json)
                    FROM tcitas_servicios ts
                    JOIN tservicios_veterinaria s ON ts.servicio_id = s.id
                    WHERE ts.cita_id = c.id_cita
                ) AS servicios_agendados

            FROM tcitas c
            JOIN tclientes cl ON c.cliente_id = cl.id
            LEFT JOIN tpacientes p ON c.mascota_id = p.id
            JOIN tanimales a ON c.animal_id = a.id_tipoanimal
            WHERE c.veterinario_id = $1
            AND c.estado = 'Confirmada'
            ORDER BY c.fecha_cita, c.hora_cita;
        `;
        const result = await pool.query(query, [veterinarioId]);
        return result.rows;
    },

  finAllData: async () => {
    console.log('[MODELO CITA] Buscando todas las citas para estadísticas (finAllData)');

    const query = `
            SELECT 
                c.*,
                cl.nombre_completo AS cliente_nombre,
                p.nombre AS mascota_nombre,
                a.nombre AS animal_nombre,
                u.nombre_completo AS veterinario_nombre
            FROM tCitas c
            JOIN tClientes cl ON c.cliente_id = cl.id
            LEFT JOIN tPacientes p ON c.mascota_id = p.id
            JOIN tAnimales a ON c.animal_id = a.id_tipoanimal
            JOIN tUsuarios u ON c.veterinario_id = u.id
            ORDER BY c.fecha_cita DESC, c.hora_cita DESC;
        `;

    try {
      const result = await pool.query(query);
      console.log(`[MODELO CITA] Se encontraron ${result.rows.length} citas`);
      return result.rows;
    } catch (error) {
      console.error('[MODELO CITA] Error al buscar todas las citas:', error);
      throw error;
    }
  },
    updateServiceStatus: async (citaId, servicioId, nuevoEstado) => {
        const query = `
            UPDATE tcitas_servicios
            SET estado = $1
            WHERE cita_id = $2 AND servicio_id = $3
            RETURNING *;
        `;
        const values = [nuevoEstado, citaId, servicioId];
        const result = await pool.query(query, values);
        return result.rows[0];
    },


    obtenerServiciosMasSolicitados: async (limit = 5) => {
        const query = `
            SELECT 
                s.titulo,
                COUNT(ts.servicio_id) AS count
            FROM tcitas_servicios ts
            JOIN tservicios_veterinaria s ON ts.servicio_id = s.id
            GROUP BY s.titulo
            ORDER BY count DESC
            LIMIT $1;
        `;
        try {
            const result = await pool.query(query, [limit]);
            return result.rows.map(row => ({
                ...row,
                count: parseInt(row.count, 10)
            }));
        } catch (error) {
            console.error("[MODELO CITA] Error al obtener servicios más solicitados:", error);
            throw error;
        }
    },
    

};

module.exports = CitaModel;
