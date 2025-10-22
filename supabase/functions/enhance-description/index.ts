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
    const { description, context, type, language } = await req.json();
    // Default to Spanish if not provided
    const lang = language || 'es';
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const contextMap: { [key: string]: string } = {
      experience: lang === 'es' ? "experiencia laboral" : "work experience",
      project: lang === 'es' ? "proyecto" : "project",
      education: lang === 'es' ? "educación" : "education",
    };

    const systemMessage = lang === 'es'
      ? "Eres un experto en redacción de CVs profesionales y optimización ATS."
      : "You are an expert in professional CV writing and ATS optimization.";

    const prompt = lang === 'es'
      ? `Mejora esta descripción de ${contextMap[type] || type} para un CV profesional.

Descripción original:
${description}

${context ? `Contexto adicional: ${context}\n` : ''}

La descripción mejorada debe:
- Usar verbos de acción impactantes
- Ser específica y cuantificable cuando sea posible
- Destacar logros y resultados
- Estar optimizada para ATS
- Tener entre 2-4 líneas
- Mantener el tono profesional

IDIOMA OBLIGATORIO: La descripción mejorada DEBE estar completamente en ESPAÑOL.

Devuelve solo la descripción mejorada, sin introducción ni explicaciones.`
      : `Improve this ${contextMap[type] || type} description for a professional CV.

Original description:
${description}

${context ? `Additional context: ${context}\n` : ''}

The improved description must:
- Use impactful action verbs
- Be specific and quantifiable when possible
- Highlight achievements and results
- Be ATS-optimized
- Be 2-4 lines long
- Maintain professional tone

MANDATORY LANGUAGE: The enhanced description MUST be completely in ENGLISH.

Return only the improved description, without introduction or explanations.`;

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
            content: systemMessage,
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
    const enhanced = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ enhanced }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error enhancing description:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
