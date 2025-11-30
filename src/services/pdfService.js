const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const PDFService = {

    // ============================================
    // RQF02 - GENERAR REPORTE MÉDICO COMPLETO
    // ============================================
    generarReporteMedico: async (expediente, consultas) => {
        return new Promise((resolve, reject) => {
            try {
                console.log('[PDF SERVICE] Iniciando generación de reporte médico...');
                
                // Crear documento PDF
                const doc = new PDFDocument({
                    size: 'LETTER',
                    margins: { top: 50, bottom: 50, left: 50, right: 50 }
                });

                // Crear directorio de reportes si no existe
                const reportesDir = path.join(__dirname, '../../reportes');
                if (!fs.existsSync(reportesDir)) {
                    fs.mkdirSync(reportesDir, { recursive: true });
                }

                // Generar nombre único para el archivo
                const timestamp = new Date().getTime();
                const nombreArchivo = `reporte_${expediente.numero_expediente}_${timestamp}.pdf`;
                const rutaArchivo = path.join(reportesDir, nombreArchivo);

                // Stream para escribir el archivo
                const stream = fs.createWriteStream(rutaArchivo);
                doc.pipe(stream);

                // ============================================
                // ENCABEZADO DEL DOCUMENTO
                // ============================================
                doc.fontSize(20)
                   .font('Helvetica-Bold')
                   .text('El Morralito+', { align: 'center' })
                   .fontSize(12)
                   .font('Helvetica')
                   .text('Clínica Veterinaria', { align: 'center' })
                   .text('Sistema de Gestión Veterinaria', { align: 'center' })
                   .moveDown(0.5);

                // Línea divisoria
                doc.moveTo(50, doc.y)
                   .lineTo(562, doc.y)
                   .stroke();
                
                doc.moveDown(1);

                // ============================================
                // INFORMACIÓN DEL EXPEDIENTE
                // ============================================
                doc.fontSize(16)
                   .font('Helvetica-Bold')
                   .text('REPORTE MÉDICO', { align: 'center' })
                   .moveDown(1);

                doc.fontSize(10)
                   .font('Helvetica-Bold')
                   .text('DATOS DEL EXPEDIENTE', { underline: true })
                   .moveDown(0.5);

                const yInicio = doc.y;
                
                // Columna izquierda
                doc.font('Helvetica-Bold').text('Número de Expediente:', 50, yInicio);
                doc.font('Helvetica').text(expediente.numero_expediente, 200, yInicio);
                
                doc.font('Helvetica-Bold').text('Fecha de Apertura:', 50, yInicio + 15);
                doc.font('Helvetica').text(this.formatearFecha(expediente.fecha_apertura), 200, yInicio + 15);
                
                doc.font('Helvetica-Bold').text('Estado:', 50, yInicio + 30);
                doc.font('Helvetica').text(expediente.estado, 200, yInicio + 30);

                // Columna derecha
                doc.font('Helvetica-Bold').text('Mascota:', 320, yInicio);
                doc.font('Helvetica').text(expediente.mascota_nombre, 420, yInicio);
                
                doc.font('Helvetica-Bold').text('Tipo:', 320, yInicio + 15);
                doc.font('Helvetica').text(expediente.tipo_animal, 420, yInicio + 15);
                
                if (expediente.raza) {
                    doc.font('Helvetica-Bold').text('Raza:', 320, yInicio + 30);
                    doc.font('Helvetica').text(expediente.raza, 420, yInicio + 30);
                }

                doc.moveDown(3);

                // ============================================
                // INFORMACIÓN DEL PROPIETARIO
                // ============================================
                doc.font('Helvetica-Bold')
                   .text('DATOS DEL PROPIETARIO', { underline: true })
                   .moveDown(0.5);

                const yPropietario = doc.y;

                doc.font('Helvetica-Bold').text('Nombre:', 50, yPropietario);
                doc.font('Helvetica').text(expediente.propietario, 200, yPropietario);
                
                doc.font('Helvetica-Bold').text('Teléfono:', 50, yPropietario + 15);
                doc.font('Helvetica').text(expediente.propietario_telefono, 200, yPropietario + 15);
                
                doc.font('Helvetica-Bold').text('Correo:', 50, yPropietario + 30);
                doc.font('Helvetica').text(expediente.propietario_correo, 200, yPropietario + 30);

                doc.moveDown(3);

                // ============================================
                // HISTORIAL DE CONSULTAS
                // ============================================
                doc.addPage();
                
                doc.fontSize(14)
                   .font('Helvetica-Bold')
                   .text('HISTORIAL DE CONSULTAS', { align: 'center' })
                   .moveDown(1);

                if (consultas && consultas.length > 0) {
                    consultas.forEach((consulta, index) => {
                        // Verificar si necesitamos una nueva página
                        if (doc.y > 650) {
                            doc.addPage();
                        }

                        // Encabezado de consulta
                        doc.fontSize(12)
                           .font('Helvetica-Bold')
                           .fillColor('#333333')
                           .text(`CONSULTA #${index + 1}`, { underline: true })
                           .moveDown(0.3);

                        const yConsulta = doc.y;

                        // Información básica
                        doc.fontSize(9)
                           .font('Helvetica-Bold')
                           .text('Fecha:', 50, yConsulta);
                        doc.font('Helvetica')
                           .text(this.formatearFecha(consulta.fecha_consulta), 120, yConsulta);

                        doc.font('Helvetica-Bold')
                           .text('Veterinario:', 250, yConsulta);
                        doc.font('Helvetica')
                           .text(consulta.veterinario, 330, yConsulta);

                        doc.moveDown(1.5);

                        // Motivo de consulta
                        doc.font('Helvetica-Bold')
                           .text('Motivo de Consulta:')
                           .font('Helvetica')
                           .text(consulta.motivo_consulta, { width: 500 })
                           .moveDown(0.5);

                        // Signos vitales
                        if (consulta.peso_actual || consulta.temperatura || consulta.frecuencia_cardiaca) {
                            doc.font('Helvetica-Bold')
                               .text('Signos Vitales:');
                            
                            let vitales = [];
                            if (consulta.peso_actual) vitales.push(`Peso: ${consulta.peso_actual} kg`);
                            if (consulta.temperatura) vitales.push(`Temperatura: ${consulta.temperatura}°C`);
                            if (consulta.frecuencia_cardiaca) vitales.push(`FC: ${consulta.frecuencia_cardiaca} lpm`);
                            
                            doc.font('Helvetica')
                               .text(vitales.join(' | '))
                               .moveDown(0.5);
                        }

                        // Diagnósticos
                        if (consulta.diagnosticos && consulta.diagnosticos.length > 0) {
                            doc.font('Helvetica-Bold')
                               .text('Diagnóstico(s):');
                            
                            consulta.diagnosticos.forEach((diag, i) => {
                                doc.font('Helvetica')
                                   .text(`${i + 1}. ${diag.descripcion} (${diag.tipo})`);
                            });
                            doc.moveDown(0.5);
                        }

                        // Tratamientos
                        if (consulta.tratamientos && consulta.tratamientos.length > 0) {
                            doc.font('Helvetica-Bold')
                               .text('Tratamiento(s):');
                            
                            consulta.tratamientos.forEach((trat, i) => {
                                doc.font('Helvetica')
                                   .text(`${i + 1}. ${trat.medicamento} - ${trat.dosis}, ${trat.frecuencia}`);
                                
                                if (trat.duracion_dias) {
                                    doc.text(`   Duración: ${trat.duracion_dias} días`);
                                }
                            });
                            doc.moveDown(0.5);
                        }

                        // Vacunas
                        if (consulta.vacunas && consulta.vacunas.length > 0) {
                            doc.font('Helvetica-Bold')
                               .text('Vacuna(s) Aplicada(s):');
                            
                            consulta.vacunas.forEach((vac, i) => {
                                doc.font('Helvetica')
                                   .text(`${i + 1}. ${vac.nombre_vacuna} - ${this.formatearFecha(vac.fecha_aplicacion)}`);
                                
                                if (vac.proxima_dosis) {
                                    doc.text(`   Próxima dosis: ${this.formatearFecha(vac.proxima_dosis)}`);
                                }
                            });
                            doc.moveDown(0.5);
                        }

                        // Procedimientos
                        if (consulta.procedimientos && consulta.procedimientos.length > 0) {
                            doc.font('Helvetica-Bold')
                               .text('Procedimiento(s):');
                            
                            consulta.procedimientos.forEach((proc, i) => {
                                doc.font('Helvetica')
                                   .text(`${i + 1}. ${proc.nombre} (${proc.tipo})`);
                                doc.text(`   ${proc.descripcion}`);
                            });
                            doc.moveDown(0.5);
                        }

                        // Observaciones
                        if (consulta.observaciones) {
                            doc.font('Helvetica-Bold')
                               .text('Observaciones:')
                               .font('Helvetica')
                               .text(consulta.observaciones, { width: 500 });
                        }

                        // Línea divisoria entre consultas
                        doc.moveDown(1);
                        doc.moveTo(50, doc.y)
                           .lineTo(562, doc.y)
                           .strokeColor('#CCCCCC')
                           .stroke()
                           .strokeColor('#000000');
                        doc.moveDown(1);
                    });
                } else {
                    doc.fontSize(10)
                       .font('Helvetica')
                       .text('No hay consultas registradas en este expediente.', { align: 'center' });
                }

                // ============================================
                // PIE DE PÁGINA
                // ============================================
                const pages = doc.bufferedPageRange();
                for (let i = 0; i < pages.count; i++) {
                    doc.switchToPage(i);

                    // Pie de página
                    doc.fontSize(8)
                       .font('Helvetica')
                       .fillColor('#666666')
                       .text(
                           `Página ${i + 1} de ${pages.count}`,
                           50,
                           doc.page.height - 50,
                           { align: 'center' }
                       )
                       .text(
                           `Generado el ${this.formatearFechaHora(new Date())}`,
                           50,
                           doc.page.height - 35,
                           { align: 'center' }
                       );
                }

                // Finalizar documento
                doc.end();

                // Esperar a que termine de escribirse
                stream.on('finish', () => {
                    console.log(`[PDF SERVICE] Reporte generado exitosamente: ${nombreArchivo}`);
                    resolve({
                        success: true,
                        nombreArchivo: nombreArchivo,
                        rutaArchivo: rutaArchivo,
                        url: `/reportes/${nombreArchivo}` // URL relativa para descargar
                    });
                });

                stream.on('error', (error) => {
                    console.error('[PDF SERVICE] Error al escribir PDF:', error);
                    reject(error);
                });

            } catch (error) {
                console.error('[PDF SERVICE] Error al generar PDF:', error);
                reject(error);
            }
        });
    },

    // ============================================
    // RQF02 - GENERAR CERTIFICADO DE SALUD
    // ============================================
    generarCertificadoSalud: async (expediente, ultimaConsulta) => {
        return new Promise((resolve, reject) => {
            try {
                console.log('[PDF SERVICE] Generando certificado de salud...');

                const doc = new PDFDocument({
                    size: 'LETTER',
                    margins: { top: 50, bottom: 50, left: 50, right: 50 }
                });

                const reportesDir = path.join(__dirname, '../../reportes');
                if (!fs.existsSync(reportesDir)) {
                    fs.mkdirSync(reportesDir, { recursive: true });
                }

                const timestamp = new Date().getTime();
                const nombreArchivo = `certificado_${expediente.numero_expediente}_${timestamp}.pdf`;
                const rutaArchivo = path.join(reportesDir, nombreArchivo);

                const stream = fs.createWriteStream(rutaArchivo);
                doc.pipe(stream);

                // Encabezado
                doc.fontSize(24)
                   .font('Helvetica-Bold')
                   .text('CERTIFICADO DE SALUD', { align: 'center' })
                   .moveDown(2);

                doc.fontSize(12)
                   .font('Helvetica')
                   .text('El Morralito+ Clínica Veterinaria', { align: 'center' })
                   .moveDown(3);

                // Contenido del certificado
                doc.fontSize(11)
                   .font('Helvetica')
                   .text('Por medio del presente certificado, se hace constar que:', { align: 'justify' })
                   .moveDown(1.5);

                doc.font('Helvetica-Bold')
                   .text(`La mascota ${expediente.mascota_nombre}`, { continued: true })
                   .font('Helvetica')
                   .text(`, ${expediente.tipo_animal}${expediente.raza ? ', raza ' + expediente.raza : ''}, `)
                   .font('Helvetica-Bold')
                   .text(`propiedad de ${expediente.propietario}`, { continued: true })
                   .font('Helvetica')
                   .text(', fue examinada en esta clínica.')
                   .moveDown(1.5);

                if (ultimaConsulta) {
                    doc.text(`Fecha de última consulta: ${this.formatearFecha(ultimaConsulta.fecha_consulta)}`)
                       .moveDown(1);

                    if (ultimaConsulta.peso_actual) {
                        doc.text(`Peso: ${ultimaConsulta.peso_actual} kg`);
                    }

                    if (ultimaConsulta.temperatura) {
                        doc.text(`Temperatura: ${ultimaConsulta.temperatura}°C`);
                    }

                    doc.moveDown(1.5);

                    doc.text('Se encuentra en buen estado de salud general y apto para las actividades normales de su especie.', { align: 'justify' })
                       .moveDown(3);
                }

                // Firma
                doc.text(`Atendido por: ${ultimaConsulta?.veterinario || 'Veterinario'}`)
                   .moveDown(2);

                doc.moveTo(350, doc.y)
                   .lineTo(550, doc.y)
                   .stroke();

                doc.text('Firma y Sello del Veterinario', 350, doc.y + 10)
                   .moveDown(3);

                // Fecha de emisión
                doc.fontSize(9)
                   .text(`Expedido el ${this.formatearFechaHora(new Date())}`, { align: 'center' });

                doc.end();

                stream.on('finish', () => {
                    console.log(`[PDF SERVICE] Certificado generado: ${nombreArchivo}`);
                    resolve({
                        success: true,
                        nombreArchivo: nombreArchivo,
                        rutaArchivo: rutaArchivo,
                        url: `/reportes/${nombreArchivo}`
                    });
                });

                stream.on('error', (error) => {
                    console.error('[PDF SERVICE] Error al escribir certificado:', error);
                    reject(error);
                });

            } catch (error) {
                console.error('[PDF SERVICE] Error al generar certificado:', error);
                reject(error);
            }
        });
    },

    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================
    formatearFecha: (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-MX', opciones);
    },

    formatearFechaHora: (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        const opciones = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('es-MX', opciones);
    }
};

module.exports = PDFService;