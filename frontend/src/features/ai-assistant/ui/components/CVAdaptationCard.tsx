import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';
import { Sparkles, Loader2, CheckCircle2, Edit2, Link } from 'lucide-react';
import { useLanguage } from '@/app/providers';
import { AdaptationData, AISuggestions } from '../../model/useAIAssistant';

interface CVAdaptationCardProps {
  jobUrl: string;
  setJobUrl: (v: string) => void;
  isExtractingUrl: boolean;
  onExtractUrl: () => void;
  jobDescription: string;
  setJobDescription: (v: string) => void;
  isAnalyzing: boolean;
  onAdaptCV: () => void;
  adaptation: AdaptationData | null;
  editedSummary: string;
  setEditedSummary: (v: string) => void;
  isEditingSummary: boolean;
  setIsEditingSummary: (v: boolean) => void;
  showApplyButton: boolean;
  onApplySuggestions: () => void;
}

export function CVAdaptationCard({
  jobUrl, setJobUrl, isExtractingUrl, onExtractUrl,
  jobDescription, setJobDescription,
  isAnalyzing, onAdaptCV,
  adaptation, editedSummary, setEditedSummary,
  isEditingSummary, setIsEditingSummary,
  showApplyButton, onApplySuggestions,
}: CVAdaptationCardProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          {t('aiAssistant.cvAdaptationTitle')}
        </CardTitle>
        <CardDescription>{t('aiAssistant.cvAdaptationDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 p-4 border rounded-lg bg-muted/10">
          <label className="text-sm font-medium flex items-center gap-2">
            <Link className="w-4 h-4" />
            URL de la oferta (opcional)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://infojobs.net/oferta/12345 o https://linkedin.com/jobs/..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <Button onClick={onExtractUrl} disabled={isExtractingUrl || !jobUrl.trim()} variant="secondary">
              {isExtractingUrl ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Extrayendo...</>
              ) : (
                <><Link className="w-4 h-4 mr-2" />Extraer</>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Pega la URL de la oferta y la IA extraerá automáticamente el título, empresa, descripción y requisitos
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('aiAssistant.jobDescription')}</label>
          <Textarea
            placeholder={t('aiAssistant.jobDescriptionFullPlaceholder')}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[150px]"
          />
        </div>

        <Button onClick={onAdaptCV} disabled={isAnalyzing || !jobDescription.trim()} className="w-full">
          {isAnalyzing ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('aiAssistant.analyzing')}</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" />{t('aiAssistant.analyzeWithAI')}</>
          )}
        </Button>

        {adaptation && (
          <div className="space-y-4 mt-6 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">{t('aiAssistant.compatibilityScore')}</h4>
              <Badge
                variant={adaptation.compatibilityScore >= 70 ? 'default' : 'secondary'}
                className="text-lg px-4 py-1"
              >
                {adaptation.compatibilityScore}/100
              </Badge>
            </div>

            <Separator />

            <div>
              <h5 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                {t('aiAssistant.matchedSkills')}
              </h5>
              <div className="flex flex-wrap gap-2">
                {adaptation.matchedSkills.map((skill, i) => (
                  <Badge key={i} variant="outline" className="bg-green-50">{skill}</Badge>
                ))}
              </div>
            </div>

            {adaptation.missingSkills.length > 0 && (
              <div>
                <h5 className="font-semibold mb-2">{t('aiAssistant.missingSkills')}</h5>
                <div className="flex flex-wrap gap-2">
                  {adaptation.missingSkills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="bg-orange-50">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h5 className="font-semibold mb-2">{t('aiAssistant.generalRecommendations')}</h5>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {adaptation.overallRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
            </div>

            {adaptation.suggestions?.summary && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold">{t('aiAssistant.suggestedSummary')}</h5>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingSummary(!isEditingSummary)}>
                    <Edit2 className="w-4 h-4 mr-1" />
                    {isEditingSummary ? t('common.cancel') : t('common.edit')}
                  </Button>
                </div>
                {isEditingSummary ? (
                  <Textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="min-h-[100px] text-sm"
                  />
                ) : (
                  <p className="text-sm bg-background p-3 rounded border">{editedSummary}</p>
                )}
              </div>
            )}

            {showApplyButton && (
              <Button onClick={onApplySuggestions} className="w-full" variant="secondary">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {t('aiAssistant.applySuggestions')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
