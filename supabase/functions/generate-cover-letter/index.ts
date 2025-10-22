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
    console.log("🚀 Iniciando generación de carta...");
    
    const { cvData, jobDescription } = await req.json();
    console.log("✅ Datos recibidos correctamente");
    
    // @ts-ignore - Deno env
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY no configurada");
      throw new Error("GEMINI_API_KEY is not configured");
    }
    
    console.log("✅ GEMINI_API_KEY encontrada:", GEMINI_API_KEY.substring(0, 10) + "...");

    const cvText = JSON.stringify(cvData);
    
    const prompt = `Genera una carta de presentación profesional y personalizada basándote en este CV y la oferta de trabajo.

CV DEL CANDIDATO:
${cvText}

OFERTA DE TRABAJO:
${jobDescription}

REGLAS ESTRICTAS - DEBES SEGUIRLAS AL PIE DE LA LETRA:
1. La carta DEBE tener entre 350-450 palabras (MÁXIMO ABSOLUTO: 500 palabras)
2. La carta DEBE caber en UNA PÁGINA A4 cuando se imprima
3. Estructurar en exactamente 3-4 párrafos cortos:
   - Párrafo 1 (2-3 líneas): Presentación breve y puesto de interés
   - Párrafo 2 (4-5 líneas): Por qué eres el candidato ideal - máximo 2-3 logros clave con datos concretos
   - Párrafo 3 (3-4 líneas): Motivación específica por la empresa/puesto
   - Párrafo 4 (2 líneas): Cierre breve con disponibilidad para entrevista

FORMATO DE SALIDA OBLIGATORIO:
- Empezar DIRECTAMENTE con el saludo (no incluir fecha, ubicación ni datos de contacto)
- Usar "Estimado/a equipo de [Empresa]:" o "Estimado/a [Nombre]:" si se conoce el nombre
- Terminar con "Atentamente," en una línea y el nombre completo del candidato en la siguiente
- NO añadir nada más después del nombre

ESTILO DE REDACCIÓN:
- Tono profesional pero cercano y moderno
- Frases cortas y directas (máximo 20-25 palabras por frase)
- Evitar clichés como "me dirijo a ustedes", "tengo el honor", etc.
- Incluir SIEMPRE números/métricas cuando sea posible (porcentajes, cantidad, tiempo)
- Mencionar tecnologías, herramientas o metodologías específicas del CV que coincidan con la oferta
- Ser específico sobre la empresa: mencionar un proyecto, valor, o aspecto concreto que atraiga
- NO repetir información obvia del CV, sino destacar lo más relevante

IMPORTANTE: 
- Prioriza CALIDAD sobre cantidad
- Menos palabras = más impacto
- Cada frase debe aportar valor
- Elimina toda palabra innecesaria

Devuelve SOLO el texto de la carta de presentación, sin formato JSON ni introducción adicional.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
    console.log("📡 Llamando a Gemini API...");
    
    const requestBody = {
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
        maxOutputTokens: 800,
      },
    };
    
    console.log("📦 Request body preparado");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

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
    
    let coverLetter = data.candidates[0].content.parts[0].text.trim();
    console.log("✅ Carta generada. Longitud:", coverLetter.length);

    // Validación de longitud
    const wordCount = coverLetter.split(/\s+/).length;
    console.log(`✅ Carta generada con ${wordCount} palabras`);

    if (wordCount > 500) {
      console.warn(`⚠️ Carta generada con ${wordCount} palabras, excede el límite de 500`);
    }

    return new Response(JSON.stringify({ coverLetter, wordCount }), {
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