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
    const { personalInfo, experience, skills, language } = await req.json();
    // Default to Spanish if not provided
    const lang = language || 'es';
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const experienceText = experience
      .map((exp: any) => `${exp.position} en ${exp.company}`)
      .join(", ");

    const skillsText = skills.join(", ");

    const systemMessage = lang === 'es'
      ? "Eres un experto en redacción de CVs profesionales y optimización ATS."
      : "You are an expert in professional CV writing and ATS optimization.";

    const prompt = lang === 'es'
      ? `Genera un resumen profesional conciso y impactante para un CV.

    Información:
    - Nombre: ${personalInfo.fullName}
    - Experiencia: ${experienceText}
    - Habilidades: ${skillsText}

    El resumen debe:
    - Tener entre 3-4 líneas
    - Destacar logros y experiencia relevante
    - Ser específico y cuantificable cuando sea posible
    - Usar verbos de acción
    - Estar optimizado para ATS

    IDIOMA OBLIGATORIO: El resumen profesional DEBE estar completamente en ESPAÑOL.

    Devuelve solo el resumen, sin introducción ni explicaciones.`
      : `Generate a concise and impactful professional summary for a CV.

    Information:
    - Name: ${personalInfo.fullName}
    - Experience: ${experienceText}
    - Skills: ${skillsText}

    The summary must:
    - Be 3-4 lines long
    - Highlight achievements and relevant experience
    - Be specific and quantifiable when possible
    - Use action verbs
    - Be ATS-optimized

    MANDATORY LANGUAGE: The professional summary MUST be completely in ENGLISH.

    Return only the summary, without introduction or explanations.`;

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
    const summary = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error generating summary:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
