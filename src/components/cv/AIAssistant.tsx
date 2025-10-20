import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { CVData } from '@/types/cv';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AIAssistantProps {
  cvData: CVData;
  onApplySuggestions?: (suggestions: any) => void;
}

export function AIAssistant({ cvData, onApplySuggestions }: AIAssistantProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [adaptation, setAdaptation] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');

  const handleAdaptCV = async () => {
    if (!jobDescription.trim()) {
      toast.error('Por favor pega la descripción de la oferta');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('adapt-cv', {
        body: { cvData, jobDescription }
      });

      if (error) throw error;

      if (data?.adaptation) {
        setAdaptation(data.adaptation);
        toast.success('Análisis completado');
      }
    } catch (error: any) {
      console.error('Error adapting CV:', error);
      toast.error('Error al analizar la oferta');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast.error('Por favor pega la descripción de la oferta');
      return;
    }

    setIsGeneratingLetter(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
        body: { cvData, jobDescription }
      });

      if (error) throw error;

      if (data?.coverLetter) {
        setCoverLetter(data.coverLetter);
        toast.success('Carta de presentación generada');
      }
    } catch (error: any) {
      console.error('Error generating cover letter:', error);
      toast.error('Error al generar la carta');
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success('Carta copiada al portapapeles');
  };

  const applyAdaptation = () => {
    if (adaptation && onApplySuggestions) {
      onApplySuggestions(adaptation.suggestions);
      toast.success('Sugerencias aplicadas');
    }
  };

  return (
    <div className="space-y-6">
      {/* Asistente de Adaptación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Asistente de Adaptación de CV con IA
          </CardTitle>
          <CardDescription>
            Pega una oferta de trabajo para analizar tu CV, obtener una puntuación de compatibilidad y recibir sugerencias de la IA para adaptar tu perfil al puesto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Descripción de la Oferta
            </label>
            <Textarea
              placeholder="Pega aquí la descripción completa de la oferta de trabajo..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <Button
            onClick={handleAdaptCV}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analizar con IA
              </>
            )}
          </Button>

          {adaptation && (
            <div className="space-y-4 mt-6 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">Puntuación de Compatibilidad</h4>
                <Badge variant={adaptation.compatibilityScore >= 70 ? "default" : "secondary"} className="text-lg px-4 py-1">
                  {adaptation.compatibilityScore}/100
                </Badge>
              </div>

              <Separator />

              <div>
                <h5 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Habilidades Coincidentes
                </h5>
                <div className="flex flex-wrap gap-2">
                  {adaptation.matchedSkills?.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-green-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {adaptation.missingSkills?.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-2">Habilidades Faltantes</h5>
                  <div className="flex flex-wrap gap-2">
                    {adaptation.missingSkills.map((skill: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-orange-50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h5 className="font-semibold mb-2">Recomendaciones Generales</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {adaptation.overallRecommendations?.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {adaptation.suggestions?.summary && (
                <div>
                  <h5 className="font-semibold mb-2">Resumen Sugerido</h5>
                  <p className="text-sm bg-background p-3 rounded border">
                    {adaptation.suggestions.summary}
                  </p>
                </div>
              )}

              {onApplySuggestions && (
                <Button onClick={applyAdaptation} className="w-full" variant="secondary">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Aplicar Sugerencias al CV
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generador de Carta de Presentación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Generador de Carta de Presentación
          </CardTitle>
          <CardDescription>
            Pega la descripción de una oferta de trabajo para generar una carta de presentación profesional y personalizada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Descripción de la Oferta
            </label>
            <Textarea
              placeholder="Pega aquí la descripción completa de la oferta..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <Button
            onClick={handleGenerateCoverLetter}
            disabled={isGeneratingLetter || !jobDescription.trim()}
            className="w-full"
          >
            {isGeneratingLetter ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generar Carta con IA
              </>
            )}
          </Button>

          {coverLetter && (
            <div className="space-y-3 mt-6 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Carta de Presentación</h4>
                <Button onClick={copyCoverLetter} size="sm" variant="outline">
                  Copiar
                </Button>
              </div>
              <div className="bg-background p-4 rounded border whitespace-pre-wrap text-sm">
                {coverLetter}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
