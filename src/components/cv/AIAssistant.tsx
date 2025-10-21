import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Loader2, FileText, CheckCircle2, Download, Copy, Eye, Edit2 } from 'lucide-react';
import { CVData } from '@/types/cv';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { generateCoverLetterPDF, generateCoverLetterPreview, CoverLetterFormat } from '@/utils/pdfGenerator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [pdfFormat, setPdfFormat] = useState<CoverLetterFormat>('minimal');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');

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
        setEditedSummary(data.adaptation.suggestions?.summary || '');
        setIsEditingSummary(false);
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
        setIsEditingLetter(false);
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

  const handlePreview = () => {
    const position = extractPosition(jobDescription);
    const options = {
      candidateName: cvData.personalInfo.fullName,
      position: position,
      format: pdfFormat,
      email: cvData.personalInfo.email,
      phone: cvData.personalInfo.phone,
      location: cvData.personalInfo.location,
      linkedin: cvData.personalInfo.linkedin,
    };

    const url = generateCoverLetterPreview(coverLetter, options);
    if (url) {
      setPreviewUrl(url);
      setShowPreview(true);
    } else {
      toast.error('Error al generar la vista previa');
    }
  };

  const downloadCoverLetterPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const position = extractPosition(jobDescription);
      const options = {
        candidateName: cvData.personalInfo.fullName,
        position: position,
        format: pdfFormat,
        email: cvData.personalInfo.email,
        phone: cvData.personalInfo.phone,
        location: cvData.personalInfo.location,
        linkedin: cvData.personalInfo.linkedin,
      };

      const success = generateCoverLetterPDF(coverLetter, options);

      if (success) {
        toast.success('PDF descargado correctamente');
      } else {
        toast.error('Error al generar el PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Error al descargar el PDF');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const extractPosition = (description: string): string => {
    const patterns = [
      /puesto[:\s]+([^\n.]+)/i,
      /posición[:\s]+([^\n.]+)/i,
      /cargo[:\s]+([^\n.]+)/i,
      /vacante[:\s]+([^\n.]+)/i,
    ];

    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return match[1].trim().substring(0, 50);
      }
    }

    return 'Oferta';
  };

  const applyAdaptation = () => {
    if (adaptation && onApplySuggestions) {
      const updatedSuggestions = {
        ...adaptation.suggestions,
        summary: editedSummary
      };
      onApplySuggestions(updatedSuggestions);
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
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold">Resumen Sugerido</h5>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingSummary(!isEditingSummary)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      {isEditingSummary ? 'Cancelar' : 'Editar'}
                    </Button>
                  </div>
                  {isEditingSummary ? (
                    <Textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      className="min-h-[100px] text-sm"
                    />
                  ) : (
                    <p className="text-sm bg-background p-3 rounded border">
                      {editedSummary}
                    </p>
                  )}
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
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingLetter(!isEditingLetter)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  {isEditingLetter ? 'Ver' : 'Editar'}
                </Button>
              </div>

              {isEditingLetter ? (
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="min-h-[300px] text-sm font-serif"
                />
              ) : (
                <div className="bg-background p-4 rounded border whitespace-pre-wrap text-sm">
                  {coverLetter}
                </div>
              )}

              <Separator />

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Formato del PDF
                </label>
                <Select value={pdfFormat} onValueChange={(value) => setPdfFormat(value as CoverLetterFormat)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Minimalista</span>
                        <span className="text-xs text-muted-foreground">Solo fecha y contenido</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="formal">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Formal</span>
                        <span className="text-xs text-muted-foreground">Con datos de contacto completos</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={copyCoverLetter} 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copiar
                </Button>
                <Button 
                  onClick={handlePreview}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Vista Previa
                </Button>
                <Button 
                  onClick={downloadCoverLetterPDF}
                  disabled={isDownloadingPDF}
                  size="sm"
                  variant="default"
                  className="flex-1"
                >
                  {isDownloadingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-1" />
                      Descargar PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Vista Previa */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>Vista Previa - Carta de Presentación</DialogTitle>
            <DialogDescription>
              Formato: {pdfFormat === 'minimal' ? 'Minimalista' : 'Formal'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-full border rounded"
                title="Vista previa del PDF"
              />
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cerrar
            </Button>
            <Button onClick={() => {
              setShowPreview(false);
              downloadCoverLetterPDF();
            }}>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}