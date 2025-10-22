import { useState } from 'react';
import { CVData } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface SummarySectionProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

export function SummarySection({ cvData, setCvData }: SummarySectionProps) {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: {
          personalInfo: cvData.personalInfo,
          experience: cvData.experience,
          skills: cvData.skills,
        }
      });

      if (error) throw error;
      
      if (data?.summary) {
        setCvData({ ...cvData, summary: data.summary });
        toast.success(t('summary.generatedSuccessfully'));
      }
    } catch (error: any) {
      toast.error(t('summary.generateError'));
      console.error(error);
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
