import { useState } from 'react';
import { CVData } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
// ✅ NUEVO: Importar Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

interface SummarySectionProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

export function SummarySection({ cvData, setCvData }: SummarySectionProps) {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ NUEVO: Función para generar resumen con Gemini directo
  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      console.log('🤖 Generando resumen profesional con Gemini...');

      // Inicializar Gemini
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Construir experiencia (usando los tipos correctos)
      const experienceText = cvData.experience && cvData.experience.length > 0
        ? cvData.experience.map(exp => {
            const period = exp.current 
              ? `${exp.startDate} - Presente`
              : `${exp.startDate} - ${exp.endDate}`;
            return `${exp.position} en ${exp.company} (${period})`;
          }).join(', ')
        : 'Sin experiencia especificada';

      // Construir skills (son strings directamente)
      const skillsText = cvData.skills && cvData.skills.length > 0
        ? cvData.skills.join(', ')
        : 'Sin habilidades especificadas';

      // Agregar soft skills si existen
      const softSkillsText = cvData.softSkills && cvData.softSkills.length > 0
        ? cvData.softSkills.join(', ')
        : '';

      // Crear prompt
      const prompt = `
Eres un experto en recursos humanos. Genera un resumen profesional conciso y atractivo para un CV basado en la siguiente información:

**Información Personal:**
- Nombre: ${cvData.personalInfo.fullName}
- Ubicación: ${cvData.personalInfo.location}

**Experiencia:**
${experienceText}

**Habilidades Técnicas:**
${skillsText}

${softSkillsText ? `**Habilidades Blandas:**\n${softSkillsText}` : ''}

**Instrucciones:**
1. Crea un resumen profesional de 3-4 líneas (máximo 100 palabras)
2. Destaca los puntos fuertes y experiencia más relevante
3. Usa un tono profesional pero accesible
4. Enfócate en el valor que puede aportar
5. NO uses clichés ni frases genéricas como "profesional altamente motivado"
6. Escribe en primera persona
7. En español
8. Hazlo único y memorable

Devuelve SOLO el resumen, sin formato markdown ni explicaciones adicionales.
      `.trim();

      // Generar resumen
      const result = await model.generateContent(prompt);
      const summary = result.response.text().trim();

      console.log('✅ Resumen generado exitosamente');

      // Actualizar CV
      setCvData({ ...cvData, summary });
      toast.success(t('summary.generatedSuccessfully'));

    } catch (error: any) {
      console.error('❌ Error al generar resumen:', error);
      toast.error(t('summary.generateError'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {t('sections.summary')}
          </CardTitle>
          <Button
            onClick={generateWithAI}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('summary.generating')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t('summary.generate')}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summary">
            {t('summary.label')}
          </Label>
          <Textarea
            id="summary"
            value={cvData.summary}
            onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
            placeholder={t('summary.placeholder')}
            rows={6}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}