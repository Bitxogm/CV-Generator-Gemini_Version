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
    
    const prompt = `Analiza este CV en relación con la siguiente oferta de trabajo y proporciona sugerencias específicas de adaptación.

CV ACTUAL:
${cvText}

OFERTA DE TRABAJO:
${jobDescription}

Proporciona el análisis en el siguiente formato JSON:
{
  "compatibilityScore": <número del 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "suggestions": {
    "summary": "Sugerencia mejorada para el resumen profesional adaptado a esta oferta",
    "skills": ["skill adicional 1", "skill adicional 2"],
    "experience": [
      {
        "position": "nombre del puesto existente",
        "suggestedDescription": "descripción mejorada enfocada en esta oferta"
      }
    ]
  },
  "overallRecommendations": ["recomendación 1", "recomendación 2"]
}

El análisis debe:
- Calcular una puntuación de compatibilidad (0-100)
- Identificar habilidades que coinciden con la oferta
- Señalar habilidades faltantes que pide la oferta
- Sugerir un resumen profesional adaptado
- Sugerir habilidades adicionales relevantes
- Mejorar descripciones de experiencia para resaltar lo relevante
- Dar recomendaciones generales

Devuelve SOLO el JSON, sin texto adicional.`;

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
            content: "Eres un experto en recursos humanos y adaptación de CVs. Respondes solo con JSON válido.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
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
    const analysisText = data.choices[0].message.content.trim();
    
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No se pudo extraer JSON de la respuesta");
    }
    
    const adaptation = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ adaptation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error adapting CV:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
