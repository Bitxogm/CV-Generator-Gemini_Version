export function parseGeminiResponse<T = any>(text: string): T {
  const clean = text.trim();

  try {
    return JSON.parse(clean) as T;
  } catch {
    const markdownMatch = clean.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownMatch) {
      return JSON.parse(markdownMatch[1]) as T;
    }

    const objectMatch = clean.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]) as T;
    }

    throw new Error('No se pudo parsear la respuesta JSON de Gemini');
  }
}
