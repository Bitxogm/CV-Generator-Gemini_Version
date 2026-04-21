import { GoogleGenerativeAI } from '@google/generative-ai';
import { CVData, JobOfferData, Suggestion } from '../../domain/entities/CV';

export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: string = 'gemini-2.5-flash';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no está configurada en .env');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Adapta un CV según una oferta de trabajo
   */
  async adaptCVToJobOffer(cvData: CVData, jobOffer: JobOfferData): Promise<CVData> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      });

      const prompt = `
Eres un experto en optimización de CVs. Adapta el siguiente CV para maximizar las posibilidades de conseguir este trabajo.

**CV ORIGINAL:**
${JSON.stringify(cvData, null, 2)}

**OFERTA DE TRABAJO:**
Puesto: ${jobOffer.title}
Empresa: ${jobOffer.company}
Descripción: ${jobOffer.description}
Requisitos: ${jobOffer.requirements.join(', ')}

**INSTRUCCIONES:**
1. Analiza las palabras clave de la oferta
2. Optimiza el resumen profesional para alinearse con el puesto
3. Reordena y destaca las habilidades más relevantes
4. Ajusta las descripciones de experiencia para resaltar logros relacionados
5. Mantén la veracidad - NO inventes información

**IMPORTANTE:** Devuelve ÚNICAMENTE un objeto JSON válido con la estructura completa del CV.
NO incluyas texto adicional, markdown, ni explicaciones. SOLO el JSON.
      `.trim();

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return this.parseJSONResponse(text);
    } catch (error) {
      console.error('Error al adaptar CV con Gemini:', error);
      throw new Error(
        `Error al adaptar CV: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Genera sugerencias de mejora para un CV
   */
  async generateSuggestions(cvData: CVData): Promise<Suggestion[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });

      const prompt = `
Analiza este CV y proporciona 5 sugerencias concretas de mejora:

${JSON.stringify(cvData, null, 2)}

Devuelve un array JSON con 5 sugerencias. Cada sugerencia debe tener:
{
  "id": "sugg_1",
  "type": "improve" | "add" | "remove",
  "section": "experience" | "skills" | "education" | "summary",
  "text": "descripción de la sugerencia",
  "priority": "high" | "medium" | "low"
}

SOLO devuelve el array JSON, sin texto adicional.
      `.trim();

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return this.parseJSONResponse(text);
    } catch (error) {
      console.error('Error al generar sugerencias:', error);
      throw error;
    }
  }

  /**
   * Genera una carta de presentación personalizada
   */
  async generateCoverLetter(cvData: CVData, jobOffer: JobOfferData): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });

      const prompt = `
Genera una carta de presentación profesional y personalizada para:

**CANDIDATO (del CV):**
${JSON.stringify(cvData.personalInfo, null, 2)}
Experiencia: ${JSON.stringify(cvData.experience?.[0], null, 2)}

**EMPRESA:** ${jobOffer.company}
**PUESTO:** ${jobOffer.title}
**DESCRIPCIÓN:**
${jobOffer.description}

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
      console.error('Error al generar carta:', error);
      throw error;
    }
  }

  /**
   * Analiza compatibilidad entre CV y oferta (0-100%)
   */
  async analyzeCompatibility(
    cvData: CVData,
    jobOffer: JobOfferData
  ): Promise<{ score: number; analysis: string; missing: string[] }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });

      const prompt = `
Analiza la compatibilidad entre este CV y la oferta:

**CV:**
${JSON.stringify(cvData, null, 2)}

**OFERTA:**
Puesto: ${jobOffer.title}
Requisitos: ${jobOffer.requirements.join(', ')}

Devuelve un JSON con:
{
  "score": número entre 0 y 100,
  "analysis": "análisis breve de la compatibilidad",
  "missing": ["habilidad 1 faltante", "habilidad 2 faltante"]
}

SOLO JSON, sin texto adicional.
      `.trim();

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return this.parseJSONResponse(text);
    } catch (error) {
      console.error('Error al analizar compatibilidad:', error);
      throw error;
    }
  }

  /**
   * Limpia y parsea respuestas JSON de Gemini
   */
  private parseJSONResponse<T = any>(text: string): T {
    let cleanText = text.trim();

    // Eliminar markdown si existe
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    try {
      return JSON.parse(cleanText) as T;
    } catch (parseError) {
      // Intenta extraer JSON del texto
      const jsonMatch = cleanText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as T;
      }
      throw new Error('No se pudo parsear la respuesta de Gemini');
    }
  }
}
1;
