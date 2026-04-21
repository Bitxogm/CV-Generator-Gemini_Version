import { GoogleGenerativeAI } from '@google/generative-ai';

export interface JobOfferExtracted {
  title: string;
  company: string;
  description: string;
  requirements: string[];
}

export class JobScraperService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName = 'gemini-2.5-flash';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no está configurada en .env');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Extrae información de una oferta de trabajo desde una URL
   */
  async extractFromUrl(url: string): Promise<JobOfferExtracted> {
    try {
      console.log(`🔍 Extrayendo información de: ${url}`);

      // LinkedIn bloquea scraping — requiere autenticación
      if (url.includes('linkedin.com')) {
        throw new Error(
          'LinkedIn no permite extracción automática. Copia y pega la descripción de la oferta manualmente.'
        );
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
          'Cache-Control': 'no-cache',
        },
      });
      if (!response.ok) {
        throw new Error(
          `Este portal de empleo no permite extracción automática (${response.status}). Copia y pega la descripción manualmente.`
        );
      }

      const html = await response.text();

      // Usar Gemini para extraer la información
      const prompt = `
Eres un experto extractor de información de ofertas de trabajo. Analiza el siguiente HTML y extrae la información clave.

**HTML DE LA OFERTA:**
${html.substring(0, 50000)} 

**INSTRUCCIONES:**
Extrae la siguiente información:
1. Título del puesto
2. Nombre de la empresa
3. Descripción completa del trabajo
4. Lista de requisitos/habilidades necesarias

**IMPORTANTE:** 
- Devuelve ÚNICAMENTE un JSON válido
- NO incluyas markdown, explicaciones ni texto adicional
- Formato exacto:
{
  "title": "título del puesto",
  "company": "nombre de la empresa",
  "description": "descripción completa del trabajo",
  "requirements": ["requisito 1", "requisito 2", "requisito 3"]
}
      `.trim();

      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Limpiar y parsear JSON
      const cleanText = text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      try {
        const extracted: JobOfferExtracted = JSON.parse(cleanText);
        console.log('✅ Información extraída correctamente');
        return extracted;
      } catch (parseError) {
        // Intentar extraer JSON del texto
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as JobOfferExtracted;
        }
        throw new Error('No se pudo parsear la respuesta de Gemini');
      }
    } catch (error) {
      console.error('❌ Error extrayendo información:', error);
      throw new Error(
        `Error al extraer información: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}