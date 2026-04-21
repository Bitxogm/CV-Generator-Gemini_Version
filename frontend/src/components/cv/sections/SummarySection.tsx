import { useState } from 'react';
import { CVData } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';


interface SummarySectionProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

export function SummarySection({ cvData, setCvData }: SummarySectionProps) {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  // Función para generar resumen con IA (ahora usa backend)
  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      console.log('🤖 Generando resumen profesional...');

      // Generar resumen básico sin IA por ahora
      // TODO: Crear endpoint /api/cvs/generate-summary en backend

      const experienceText = cvData.experience && cvData.experience.length > 0
        ? cvData.experience.map(exp => `${exp.position} en ${exp.company}`).join(', ')
        : 'experiencia profesional';

      const skillsText = cvData.skills && cvData.skills.length > 0
        ? cvData.skills.slice(0, 5).join(', ')
        : 'habilidades técnicas';

      const summary = `Profesional con experiencia en ${experienceText}. Especializado en ${skillsText}. Busco contribuir con mis conocimientos y experiencia en un entorno dinámico y desafiante.`;

      setCvData({ ...cvData, summary });
      toast.success('Resumen básico generado. Personalízalo según tu perfil.');

      console.log('✅ Resumen generado');

    } catch (error: unknown) {
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