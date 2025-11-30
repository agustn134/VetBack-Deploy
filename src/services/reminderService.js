// src/services/reminderService.js
// (Sin cambios respecto a la respuesta anterior, la lógica de Tarea 1 y Tarea 2 es correcta)

const cron = require('node-cron');
const { pool } = require('../db/config'); //
// Importamos las funciones de email que necesitamos
const { enviarConfirmacionCita, enviarNotificacionHito } = require('./emailService'); //
// Importamos el servicio de IA
const { generarRecomendacionesProactivas } = require('./aiAnalysisService'); //

/**
 * TAREA 1: Enviar recordatorios (confirmación) de citas para mañana.
 */
const enviarRecordatoriosDeConfirmacion = async () => {
  console.log('[CRON TAREA 1] Ejecutando: buscando citas "Por Confirmar" para mañana...');

  // Consulta para obtener las citas de mañana que AÚN no han sido confirmadas
  const query = `
    SELECT 
      c.id_cita, 
      c.fecha_cita, 
      c.hora_cita, 
      c.token_confirmacion,
      cl.nombre_completo AS nombre_cliente, 
      cl.correo AS email_cliente,
      p.nombre AS nombre_paciente
    FROM public.tcitas c
    JOIN public.tclientes cl ON c.cliente_id = cl.id
    LEFT JOIN public.tpacientes p ON c.mascota_id = p.id
    WHERE c.fecha_cita = (CURRENT_DATE + INTERVAL '1 day')
      AND c.estado = 'Por Confirmar';
  `; //

  try {
    const result = await pool.query(query);
    const citas = result.rows;

    if (citas.length === 0) {
      console.log('[CRON TAREA 1] No se encontraron citas "Por Confirmar" para mañana.');
      return;
    }

    console.log(`[CRON TAREA 1] Se encontraron ${citas.length} citas. Enviando correos de confirmación...`);

    for (const cita of citas) {
      await enviarConfirmacionCita(cita, cita.email_cliente, cita.nombre_cliente); //
    }
    
    console.log('[CRON TAREA 1] Correos de confirmación (24h) enviados.');
  
  } catch (error) {
    console.error('[CRON TAREA 1] Error al ejecutar la tarea de recordatorios:', error);
  }
};


/**
 * TAREA 2 (NUEVA): Enviar correos proactivos de IA para hitos (Vencimiento de Vacunas)
 */
const enviarAlertasDeHitos = async () => {
    console.log('[CRON TAREA 2] Ejecutando: buscando hitos de mascotas (IA Proactiva)...');

    // Buscamos vacunas cuya próxima dosis sea HOY
    const query = `
        SELECT 
            v.proxima_dosis,
            p.id AS id_paciente,
            p.nombre AS mascota_nombre,
            c.nombre_completo AS cliente_nombre,
            c.correo AS cliente_correo
        FROM public.tvacunas v
        JOIN public.tconsultas con ON v.consulta_id = con.id_consulta
        JOIN public.texpedientes e ON con.expediente_id = e.id_expediente
        JOIN public.tpacientes p ON e.paciente_id = p.id
        JOIN public.tclientes c ON p.cliente_id = c.id
        WHERE v.proxima_dosis = CURRENT_DATE;
    `; //

    try {
        const result = await pool.query(query);
        const hitos = result.rows;

        if (hitos.length === 0) {
            console.log('[CRON TAREA 2] No se encontraron hitos (vacunas) para hoy.');
            return;
        }

        console.log(`[CRON TAREA 2] Se encontraron ${hitos.length} hitos. Generando correos de IA...`);

        for (const hito of hitos) {
            
            // 1. Llamamos a la IA (que ahora SÍ busca el historial básico)
            const iaData = await generarRecomendacionesProactivas(hito.id_paciente); //

            if (iaData && iaData.recomendacionesHtml) {
                // 2. Enviamos el NUEVO correo de Hito
                await enviarNotificacionHito( //
                    iaData.mascota, // Objeto con datos de la mascota
                    hito.cliente_correo,
                    hito.cliente_nombre,
                    iaData.recomendacionesHtml // Consejos de la IA
                );
            } else {
                 console.log(`[CRON TAREA 2] Falló la generación de IA para paciente ID: ${hito.id_paciente}. No se envió correo.`);
            }
        }
        
        console.log('[CRON TAREA 2] Correos de hitos (IA) enviados.');

    } catch (error)
 {
        console.error('[CRON TAREA 2] Error al ejecutar la tarea de hitos:', error);
    }
};


/**
 * Inicia los "Cron Jobs".
 */
const initScheduledJobs = () => {
  // Tarea 1: Recordatorios de confirmación (9:00 AM)
  cron.schedule('19 17 * * *', enviarAlertasDeHitos, {
    scheduled: true,
    timezone: "America/Mexico_City"
  });

  // Tarea 2: Correos de Hitos con IA (9:10 AM)
  cron.schedule('10 9 * * *', enviarAlertasDeHitos, {
    scheduled: true,
    timezone: "America/Mexico_City"
  });

  console.log('[CRIS] Servicios programados (Recordatorios 9:00 AM y Hitos IA 9:10 AM) listos.');
}; //

module.exports = { initScheduledJobs };