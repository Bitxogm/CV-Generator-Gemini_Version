// @ts-ignore - Deno types
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// @ts-ignore - Deno serve
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Iniciando análisis de CV...");

    const { cvData, jobDescription, language } = await req.json();
    // Default to Spanish if not provided
    const lang = language || 'es';
    console.log("✅ Datos recibidos correctamente. Idioma:", lang);
    
    // @ts-ignore - Deno env
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY no configurada");
      throw new Error("GEMINI_API_KEY is not configured");
    }
    
    console.log("✅ GEMINI_API_KEY encontrada");

    const cvText = JSON.stringify(cvData);

    const prompt = lang === 'es'
      ? `Analiza este CV en relación con la siguiente oferta de trabajo y proporciona un análisis detallado.

CV DEL CANDIDATO:
${cvText}

OFERTA DE TRABAJO:
${jobDescription}

Proporciona el análisis en formato JSON con la siguiente estructura exacta:
{
  "compatibilityScore": número entre 0-100,
  "matchedSkills": array de strings con habilidades que coinciden,
  "missingSkills": array de strings con habilidades que faltan,
  "overallRecommendations": array de strings con recomendaciones generales,
  "suggestions": {
    "summary": string con un resumen sugerido adaptado a la oferta (máximo 150 palabras)
  }
}

IMPORTANTE:
- Devuelve SOLO el JSON, sin texto adicional antes o después.
- El JSON debe ser válido y parseable.
- No uses markdown code blocks (no \`\`\`json).
- Las habilidades deben ser específicas y relevantes.
- El resumen sugerido debe destacar aspectos del CV que coincidan con la oferta.

IDIOMA OBLIGATORIO: Todo el análisis, recomendaciones, habilidades y texto DEBE estar en ESPAÑOL. Incluso si la oferta de trabajo está en otro idioma, TÚ DEBES RESPONDER EN ESPAÑOL.`
      : `Analyze this CV in relation to the following job posting and provide a detailed analysis.

CANDIDATE'S CV:
${cvText}

JOB POSTING:
${jobDescription}

Provide the analysis in JSON format with the following exact structure:
{
  "compatibilityScore": number between 0-100,
  "matchedSkills": array of strings with matching skills,
  "missingSkills": array of strings with missing skills,
  "overallRecommendations": array of strings with general recommendations,
  "suggestions": {
    "summary": string with a suggested summary adapted to the job posting (maximum 150 words)
  }
}

IMPORTANT:
- Return ONLY the JSON, without additional text before or after.
- The JSON must be valid and parseable.
- Do not use markdown code blocks (no \`\`\`json).
- Skills must be specific and relevant.
- The suggested summary should highlight CV aspects that match the job posting.

MANDATORY LANGUAGE: All analysis, recommendations, skills, and text MUST be in ENGLISH. Even if the job posting is in another language, YOU MUST RESPOND IN ENGLISH.`;

    console.log("📡 Llamando a Gemini API...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        }),
      }
    );

    console.log("📥 Respuesta recibida. Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error de Gemini API:", response.status, errorText);
      throw new Error(`Error del servicio de IA: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Respuesta parseada correctamente");
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error("❌ Formato de respuesta inválido:", JSON.stringify(data));
      throw new Error("Respuesta inválida de la IA");
    }
    
    let responseText = data.candidates[0].content.parts[0].text.trim();
    console.log("✅ Texto recibido. Longitud:", responseText.length);
    
    // Limpiar posibles backticks de markdown
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log("🔧 Parseando JSON...");
    const adaptation = JSON.parse(responseText);
    console.log("✅ JSON parseado correctamente");

    return new Response(JSON.stringify({ adaptation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("💥 ERROR CRÍTICO:", error);
    console.error("💥 Stack:", error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Error desconocido",
        details: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});