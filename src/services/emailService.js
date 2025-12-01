// /home/agus/Documentos/VetHealth/VetBack/src/services/emailService.js

const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar el transportador de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verificar la conexión al iniciar
transporter.verify((error, success) => {
    if (error) {
        console.error('[EMAIL SERVICE] Error al conectar con Gmail:', error);
    } else {
        console.log('[EMAIL SERVICE] Servicio de correo listo para enviar mensajes');
    }
});

/**
 * NUEVO (Paso 1) - Enviar correo de REGISTRO INMEDIATO
 * Un correo simple que solo notifica que la cita fue agendada.
 */
const enviarNotificacionRegistro = async (cita, clienteCorreo, clienteNombre) => {
    console.log(`[EMAIL SERVICE] Enviando notificación de REGISTRO de cita ID: ${cita.id_cita} a ${clienteCorreo}`);
    
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: clienteCorreo,
        subject: `Tu cita ha sido registrada - Veterinaria "El Morralito"`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #ffc107; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; color: #333;">Veterinaria "El Morralito"</h1>
                        <p style="margin: 5px 0 0 0;">Cuidamos de tu mascota</p>
                    </div>
                    <div class="content">
                        <h2>¡Hola ${clienteNombre}!</h2>
                        <p>Hemos recibido y **registrado** tu solicitud de cita en nuestro sistema.</p>
                        
                        <div class="info-box">
                            <h3 style="margin-top: 0;">Detalles de tu cita:</h3>
                            <p><strong>Fecha:</strong> ${cita.fecha_cita}</p>
                            <p><strong>Hora:</strong> ${cita.hora_cita}</p>
                            <p><strong>Motivo:</strong> ${cita.motivo}</p>
                        </div>
                        
                        <p>
                            Pronto recibirás un correo (24 horas antes de tu cita) para que puedas **confirmar tu asistencia**.
                        </p>
                        <p>¡Gracias por tu confianza!</p>
                        
                    </div>
                    <div class="footer">
                        <p>Veterinaria "El Morralito" | Sistema de Gestión Veterinaria</p>
                        <p>Este es un correo automático, por favor no responder.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SERVICE] Correo de registro enviado: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[EMAIL SERVICE] ❌ Error al enviar correo de registro:', error);
        return { success: false, error: error.message };
    }
};


/**
 * RQF01 (Paso 2) - Enviar correo de PENDIENTE DE CONFIRMACIÓN (Recordatorio 24h)
 * Se le pasa el token para que el cliente confirme la cita.
 */
const enviarConfirmacionCita = async (cita, clienteCorreo, clienteNombre) => {
    console.log(`[EMAIL SERVICE] Enviando solicitud de CONFIRMACIÓN de cita ID: ${cita.id_cita} a ${clienteCorreo}`);
    
    // URL de confirmación que apunta al nuevo endpoint del controlador
    const CONFIRMATION_URL = `http://vetback-api.onrender.com/api/citas/confirmar/${cita.token_confirmacion}`;
    
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: clienteCorreo,
        subject: `¡ACCIÓN REQUERIDA! Confirma tu Cita - Veterinaria "El Morralito"`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #ffc107; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107; }
                    
                    /* ===== DISEÑO DE BOTÓN ACTUALIZADO ===== */
                    .button-confirm { 
                        display: inline-block; 
                        padding: 12px 30px; 
                        background-color: #e9ecef; /* Gris claro */
                        color: #212529; /* Texto oscuro para gris claro */
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold; 
                        margin: 20px 0;
                        border: 1px solid #ced4da; /* Borde sutil */
                    }
                    .button-confirm:hover {
                        background-color: #dee2e6; /* Gris un poco más oscuro al pasar el mouse */
                    }
                    /* ======================================= */

                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                    .alert { color: #dc3545; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; color: #333;">Veterinaria "El Morralito"</h1>
                        <p style="margin: 5px 0 0 0;">Tu clínica veterinaria de confianza</p>
                    </div>
                    <div class="content">
                        <h2>¡Hola ${clienteNombre}!</h2>
                        <p>Tu cita está **POR CONFIRMAR**. Por favor, haz clic en el siguiente botón para confirmar tu asistencia.</p>
                        
                        <div class="info-box">
                            <h3 style="margin-top: 0;">Detalles de tu cita:</h3>
                            <p><strong>Fecha:</strong> ${cita.fecha_cita}</p>
                            <p><strong>Hora:</strong> ${cita.hora_cita}</p>
                            <p><strong>Motivo:</strong> ${cita.motivo}</p>
                            <p><strong>Estado:</strong> <span class="alert">PENDIENTE DE CONFIRMACIÓN</span></p>
                        </div>
                        
                        <center>
                            <a href="${CONFIRMATION_URL}" class="button-confirm">
                                CONFIRMAR MI CITA AHORA
                            </a>
                        </center>
                        
                        <p class="alert">
                            **IMPORTANTE:** Si no confirmas tu cita, el horario será liberado automáticamente.
                        </p>
                        
                    </div>
                    <div class="footer">
                        <p>Veterinaria "El Morralito" | Sistema de Gestión Veterinaria</p>
                        <p>Este es un correo automático, por favor no responder.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SERVICE] Correo de confirmación enviado: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[EMAIL SERVICE] ❌ Error al enviar correo de confirmación:', error);
        return { success: false, error: error.message };
    }
};

/**
 * RQF01 - Enviar notificación de reprogramación
 */
const enviarNotificacionReprogramacion = async (cita, clienteCorreo, clienteNombre) => {
    console.log(`[EMAIL SERVICE] Enviando notificación de reprogramación a ${clienteCorreo}`);
    
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: clienteCorreo,
        subject: `Cita Reprogramada - Veterinaria "El Morralito"`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #ffc107; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; color: #333;">Veterinaria "El Morralito"</h1>
                    </div>
                    <div class="content">
                        <h2>¡Hola ${clienteNombre}!</h2>
                        <p>Tu cita ha sido <strong>reprogramada</strong>.</p>
                        
                        <div class="info-box">
                            <h3 style="margin-top: 0;">Nueva fecha y hora:</h3>
                            <p><strong>Fecha:</strong> ${cita.fecha_cita}</p>
                            <p><strong>Hora:</strong> ${cita.hora_cita}</p>
                            <p><strong>Motivo:</strong> ${cita.motivo}</p>
                        </div>
                        
                        <p>Nos vemos pronto</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SERVICE] Correo de reprogramación enviado: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[EMAIL SERVICE] Error al enviar correo:', error);
        return { success: false, error: error.message };
    }
};

/**
 * RQF01 - Enviar notificación de cancelación
 */
const enviarNotificacionCancelacion = async (cita, clienteCorreo, clienteNombre) => {
    console.log(`[EMAIL SERVICE] Enviando notificación de cancelación a ${clienteCorreo}`);
    
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: clienteCorreo,
        subject: `Cita Cancelada - Veterinaria "El Morralito"`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #dc3545; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; color: white; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #dc3545; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0;">Veterinaria "El Morralito"</h1>
                    </div>
                    <div class="content">
                        <h2>¡Hola ${clienteNombre}!</h2>
                        <p>Lamentamos informarte que tu cita ha sido <strong>cancelada</strong>.</p>
                        
                        <div class="info-box">
                            <h3 style="margin-top: 0;">Detalles de la cita cancelada:</h3>
                            <p><strong>Fecha:</strong> ${cita.fecha_cita}</p>
                            <p><strong>Hora:</strong> ${cita.hora_cita}</p>
                            <p><strong>Motivo:</strong> ${cita.motivo}</p>
                        </div>
                        
                        <p>Si deseas agendar una nueva cita, por favor contáctanos.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SERVICE] Correo de cancelación enviado: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[EMAIL SERVICE] Error al enviar correo:', error);
        return { success: false, error: error.message };
    }
};

const enviarNotificacionHito = async (mascota, clienteCorreo, clienteNombre, consejosIAHtml) => {
    console.log(`[EMAIL SERVICE] Enviando correo de HITO (IA) para: ${mascota.mascota_nombre} a ${clienteCorreo}`);
    
    // El enlace que solicitaste
    const AGENDAR_CITA_URL = "https://elmorralitovet.web.app/solicitar-cita";
    
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: clienteCorreo,
        subject: `¡Consejos de cuidado para ${mascota.mascota_nombre}! 🐾`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #ffc107; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .ia-box { background-color: #e6f7ff; border-left: 5px solid #1890ff; padding: 15px; margin: 20px 0; }
                    .ia-box ul { margin-bottom: 0; }
                    .button-cta { 
                        display: inline-block; 
                        padding: 12px 30px; 
                        background-color: #28a745; /* Botón verde para CTA */
                        color: #ffffff; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold; 
                        margin: 20px 0;
                        text-align: center;
                    }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; color: #333;">Veterinaria "El Morralito"</h1>
                    </div>
                    <div class="content">
                        <h2>¡Hola ${clienteNombre}!</h2>
                        <p>Nos importa mucho la salud de <strong>${mascota.mascota_nombre}</strong>. Basado en su edad (${mascota.edad} años) y raza (${mascota.raza || 'Mixta'}), nuestro asistente de IA ha preparado algunos consejos de cuidado para ti:</p>
                        
                        <div class="ia-box">
                            <h4 style="margin-top: 0; color: #0056b3;">🤖 Consejos de Cuidado Proactivo</h4>
                            ${consejosIAHtml}
                        </div>
                        
                        <p>Esperamos que estos consejos te sean útiles. Recuerda que la prevención es clave para una vida larga y feliz.</p>
                        
                        <p>Si ha pasado tiempo desde su último chequeo o si quieres revisar alguno de estos puntos, ¡estamos aquí para ayudarte!</p>

                        <center>
                            <a href="${AGENDAR_CITA_URL}" class="button-cta">
                                Agendar una Cita Ahora
                            </a>
                        </center>
                        
                    </div>
                    <div class="footer">
                        <p>Veterinaria "El Morralito" | Sistema de Gestión Veterinaria</p>
                        <p>Este es un correo automático, por favor no responder.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SERVICE] Correo de HITO (IA) enviado: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[EMAIL SERVICE] ❌ Error al enviar correo de HITO (IA):', error);
        return { success: false, error: error.message };
    }
};

const enviarNotificacionTerminacion = async (cita, correoCliente, nombreCliente) => {
  
  // Construir la lista HTML de servicios realizados
  let serviciosHtml = '';
  
  // Verificamos si 'cita.servicios_agendados' existe y es un array
  // Nota: El backend (cita.model.js) devuelve esto como un array JSON
  if (cita.servicios_agendados && Array.isArray(cita.servicios_agendados) && cita.servicios_agendados.length > 0) {
      serviciosHtml = `
        <div style="background-color: white; border: 1px solid #eee; border-radius: 5px; padding: 10px; margin-top: 10px;">
            <p style="margin: 0 0 5px 0; font-weight: bold; color: #555;">Servicios realizados:</p>
            <ul style="margin: 0; padding-left: 20px; color: #666;">
                ${cita.servicios_agendados.map(s => `<li style="margin-bottom: 3px;">${s.titulo}</li>`).join('')}
            </ul>
        </div>
      `;
  } else {
      // Fallback si no hay servicios específicos (ej. consulta general) o no cargaron
      serviciosHtml = `<p style="margin: 5px 0;"><strong>Servicio:</strong> ${cita.motivo}</p>`;
  }

  const mailOptions = {
    from: `"Pet Health+ 🐾" <${process.env.EMAIL_USER}>`,
    to: correoCliente,
    subject: '¡Tu mascota está lista! - Veterinaria "El Morralito"',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #FFC107; padding: 20px; text-align: center;"> <!-- Amarillo Morralito -->
          <h2 style="color: #333; margin: 0;">¡Servicio Completado!</h2>
        </div>
        <div style="padding: 20px; color: #333;">
          <p>Hola <strong>${nombreCliente}</strong>,</p>
          <p>Nos complace informarte que el servicio para tu mascota ha finalizado exitosamente.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date(cita.fecha_cita).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Hora:</strong> ${cita.hora_cita}</p>
            
            <!-- AQUÍ INSERTAMOS LA LISTA DE SERVICIOS -->
            ${serviciosHtml}

          </div>

          <p style="font-size: 18px; text-align: center; font-weight: bold; color: #2ECC71;">
            ¡Ya puedes pasar a recoger a tu mascota!
          </p>
        </div>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>Veterinaria "El Morralito" | Cuidamos lo que más amas</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] Correo de terminación enviado a: ${correoCliente}`);
    return { success: true };
  } catch (error) {
    console.error('[EMAIL SERVICE] Error al enviar correo:', error);
    return { success: false, error };
  }
};

module.exports = {
    enviarNotificacionRegistro,
    enviarConfirmacionCita,
    enviarNotificacionReprogramacion,
    enviarNotificacionCancelacion,
    enviarNotificacionHito,
    enviarNotificacionTerminacion
};