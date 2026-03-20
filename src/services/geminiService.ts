// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CVData } from "@/types/cv";

export interface CompatibilityAnalysis {
  score: number;
  analysis: string;
  missing: string[];
}

export type AdaptedCVData = Partial<CVData>;

// Inicializar Gemini con tu API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("⚠️ VITE_GEMINI_API_KEY no está configurada en .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Adapta un CV según una descripción de trabajo usando Gemini 2.5 Flash
 * @param cvData - Datos del CV a adaptar
 * @param jobDescription - Descripción del trabajo objetivo
 * @returns CV adaptado
 */
export async function adaptCVWithGemini(
  cvData: CVData,
  jobDescription: string,
): Promise<AdaptedCVData> {
  try {
    // ✅ Modelo estable recomendado por Google
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `
Eres un experto en optimización de CVs. Tu tarea es adaptar el siguiente CV para maximizar las posibilidades de conseguir el trabajo descrito.

**CV ORIGINAL:**
${JSON.stringify(cvData, null, 2)}

**DESCRIPCIÓN DEL TRABAJO:**
${jobDescription}

**INSTRUCCIONES:**
1. Analiza las palabras clave del trabajo
2. Optimiza el resumen profesional para alinearse con el puesto
3. Reordena y destaca las habilidades más relevantes
4. Ajusta las descripciones de experiencia para resaltar logros relacionados
5. Mantén la veracidad - NO inventes información

**IMPORTANTE:** Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura:
{
  "personalInfo": { ... },
  "summary": "Resumen profesional optimizado",
  "experience": [ ... ],
  "education": [ ... ],
  "skills": [ ... ],
  "languages": [ ... ],
  "certifications": [ ... ]
}

NO incluyas texto adicional, markdown, ni explicaciones. SOLO el JSON.
    `.trim();

    console.log("🤖 Llamando a Gemini 2.5 Flash...");
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("✅ Respuesta recibida de Gemini");

    // Limpiar y parsear el JSON
    let cleanText = text.trim();

    // Eliminar markdown si existe
    cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    try {
      const parsedCV = JSON.parse(cleanText) as AdaptedCVData;
      return parsedCV;
    } catch (parseError) {
      console.warn("⚠️ La respuesta no es JSON válido, intentando extraer...");
      // Intenta extraer JSON del texto
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as AdaptedCVData;
      }
      throw new Error("No se pudo parsear la respuesta de Gemini");
    }
  } catch (error) {
    console.error("❌ Error al adaptar CV con Gemini:", error);
    throw new Error(
      `Error al adaptar CV: ${error instanceof Error ? error.message : "Error desconocido"}`,
    );
  }
}

/**
 * Genera sugerencias de mejora para un CV
 * @param cvData - Datos del CV a analizar
 * @returns Sugerencias de mejora
 */
export async function generateCVSuggestions(cvData: CVData): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Analiza este CV y proporciona 5 sugerencias concretas de mejora:

${JSON.stringify(cvData, null, 2)}

Devuelve un array JSON con 5 sugerencias específicas y accionables.
Formato: ["sugerencia 1", "sugerencia 2", ...]

SOLO devuelve el array JSON, sin texto adicional.
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Limpiar markdown
    const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("❌ Error al generar sugerencias:", error);
    throw error;
  }
}

/**
 * Analiza compatibilidad entre CV y trabajo (0-100%)
 * @param cvData - Datos del CV
 * @param jobDescription - Descripción del trabajo
 * @returns Puntuación de compatibilidad
 */
export async function analyzeCVCompatibility(
  cvData: CVData,
  jobDescription: string,
): Promise<CompatibilityAnalysis> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Analiza la compatibilidad entre este CV y el trabajo:

**CV:**
${JSON.stringify(cvData, null, 2)}

**TRABAJO:**
${jobDescription}

Devuelve un JSON con:
{
  "score": número entre 0 y 100,
  "analysis": "análisis breve de la compatibilidad",
  "missing": ["habilidad 1 faltante", "habilidad 2 faltante", ...]
}

SOLO JSON, sin texto adicional.
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("❌ Error al analizar compatibilidad:", error);
    throw error;
  }
}

/**
 * Genera carta de presentación personalizada
 * @param cvData - Datos del CV
 * @param jobDescription - Descripción del trabajo
 * @param companyName - Nombre de la empresa
 * @returns Carta de presentación
 */
export async function generateCoverLetter(
  cvData: CVData,
  jobDescription: string,
  companyName: string,
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Genera una carta de presentación profesional y personalizada para:

**CANDIDATO (del CV):**
${JSON.stringify(cvData.personalInfo, null, 2)}
Experiencia: ${JSON.stringify(cvData.experience?.[0], null, 2)}

**EMPRESA:** ${companyName}
**PUESTO:**
${jobDescription}

Requisitos:
- Profesional pero cálida
- Máximo 3 párrafos
- Destaca logros relevantes
- Muestra entusiasmo genuino
- En español

Devuelve SOLO el texto de la carta, sin formato markdown.
    `.trim();

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("❌ Error al generar carta:", error);
    throw error;
  }
}

// Función auxiliar para validar la respuesta de Gemini
function validateGeminiResponse(text: string): boolean {
  return text && text.length > 0 && !text.includes("Error");
}

export default {
  adaptCVWithGemini,
  generateCVSuggestions,
  analyzeCVCompatibility,
  generateCoverLetter,
};
