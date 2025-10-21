import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvData, jobDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Eres un experto en redacción de cartas de presentación profesionales. SIEMPRE generas cartas concisas de máximo 450 palabras que caben perfectamente en una página A4. Priorizas calidad sobre cantidad y cada palabra cuenta.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 800, // Limitar tokens para forzar brevedad
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Por favor intenta más tarde." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Fondos insuficientes. Por favor agrega créditos." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Error del servicio de IA");
    }

    const data = await response.json();
    let coverLetter = data.choices[0].message.content.trim();

    // Validación de longitud
    const wordCount = coverLetter.split(/\s+/).length;
    console.log(`Carta generada con ${wordCount} palabras`);

    // Si la carta es demasiado larga, alertar (opcional: podrías regenerar automáticamente)
    if (wordCount > 500) {
      console.warn(`⚠️ Carta generada con ${wordCount} palabras, excede el límite de 500`);
    }

    return new Response(JSON.stringify({ coverLetter, wordCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error generating cover letter:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});