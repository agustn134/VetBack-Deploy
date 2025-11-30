// src/services/aiAnalysisService.js
const OpenAI = require("openai");
const { pool } = require("../db/config");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Genera consejos de cuidado general basados en edad/raza e historial médico.
 * Incluye logs detallados para depuración.
 */
const generarRecomendacionesProactivas = async (pacienteId) => {
  console.log("───────────────────────────────────────────────");
  console.log(`[IA] 🧠 Iniciando generación de recomendaciones para paciente ID: ${pacienteId}`);
  console.log("───────────────────────────────────────────────");

  const query = `
    SELECT 
        p.id,
        p.nombre AS mascota_nombre, 
        p.raza, 
        p.edad,
        a.nombre AS tipo_animal,
        c.nombre_completo AS cliente_nombre,
        c.correo AS cliente_correo,
        con.fecha_consulta AS ultima_visita,
        diag.descripcion AS ultimo_diagnostico
    FROM public.tpacientes p
    JOIN public.tanimales a ON p.animal_id = a.id_tipoanimal
    JOIN public.tclientes c ON p.cliente_id = c.id
    LEFT JOIN public.texpedientes e ON p.id = e.paciente_id
    LEFT JOIN LATERAL (
        SELECT *
        FROM public.tconsultas
        WHERE expediente_id = e.id_expediente
        ORDER BY fecha_consulta DESC
        LIMIT 1
    ) con ON true
    LEFT JOIN LATERAL (
        SELECT *
        FROM public.tdiagnosticos
        WHERE consulta_id = con.id_consulta
        ORDER BY id_diagnostico ASC
        LIMIT 1
    ) diag ON true
    WHERE p.id = $1;
  `;

  try {
    console.log(`[IA] 🔍 Consultando información del paciente en BD...`);
    const result = await pool.query(query, [pacienteId]);
    if (result.rows.length === 0) {
      console.log(`[IA] ⚠️ No se encontró mascota con ID ${pacienteId}`);
      return null;
    }

    const mascota = result.rows[0];
    console.log(`[IA] ✅ Mascota encontrada: ${mascota.mascota_nombre}`);
    console.log(`[IA] Especie: ${mascota.tipo_animal} | Raza: ${mascota.raza || "Mixta"} | Edad: ${mascota.edad} años`);
    console.log(`[IA] Último diagnóstico: ${mascota.ultimo_diagnostico || "Ninguno"} | Última visita: ${mascota.ultima_visita || "No registrada"}`);

    const prompt = `
Eres un asistente veterinario amable y experto. 
Genera EXACTAMENTE 5 tips breves (1–2 líneas cada uno) para cuidar a la siguiente mascota:

- Nombre: ${mascota.mascota_nombre}
- Especie: ${mascota.tipo_animal}
- Raza: ${mascota.raza || "Mixta"}
- Edad: ${mascota.edad} años
- Último diagnóstico: ${mascota.ultimo_diagnostico || "Ninguno"}
- Última visita: ${mascota.ultima_visita || "No registrada"}

Usa viñetas con el símbolo "•".
No incluyas saludos, ni introducciones, ni texto adicional — solo los 5 tips.
    `;

    console.log("[IA] 🚀 Enviando prompt a OpenAI...");
    console.log("───────────────────────────────────────────────");
    console.log(prompt);
    console.log("───────────────────────────────────────────────");

    // Llamada a GPT-4o-mini
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("[IA] ✅ Respuesta recibida de OpenAI");

    const texto = completion.choices[0].message.content;
    console.log("───────────────────────────────────────────────");
    console.log("📋 RESPUESTA COMPLETA IA:");
    console.log(texto);
    console.log("───────────────────────────────────────────────");

    const recomendacionesHtml =
      "<ul>" +
      texto
        .split("•")
        .slice(1)
        .map((t) => `<li>${t.trim()}</li>`)
        .join("") +
      "</ul>";

    console.log(`[IA] 🧩 Recomendaciones procesadas correctamente para ${mascota.mascota_nombre}`);
    console.log("───────────────────────────────────────────────\n");

    return {
      recomendacionesHtml,
      mascota,
    };
  } catch (error) {
    console.error(`[IA] ❌ Error al generar recomendaciones: ${error.message}`);
    if (error.response) {
      console.error("[IA] 🔎 Detalle de respuesta:", error.response.data);
    }
    console.error("───────────────────────────────────────────────\n");
    return null;
  }
};

module.exports = { generarRecomendacionesProactivas };
