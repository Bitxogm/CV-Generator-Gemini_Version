import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Separator } from '@/shared/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/shared/ui/select';
import { FileText, Loader2, Edit2, Copy, Eye, Download } from 'lucide-react';
import { useLanguage } from '@/app/providers';
import { CoverLetterFormat } from '@/shared/utils';

interface CoverLetterCardProps {
  jobDescription: string;
  setJobDescription: (v: string) => void;
  isGeneratingLetter: boolean;
  onGenerateLetter: () => void;
  coverLetter: string;
  setCoverLetter: (v: string) => void;
  isEditingLetter: boolean;
  setIsEditingLetter: (v: boolean) => void;
  pdfFormat: CoverLetterFormat;
  setPdfFormat: (v: CoverLetterFormat) => void;
  onCopy: () => void;
  onPreview: () => void;
  onDownloadPDF: () => void;
  isDownloadingPDF: boolean;
}

export function CoverLetterCard({
  jobDescription, setJobDescription,
  isGeneratingLetter, onGenerateLetter,
  coverLetter, setCoverLetter,
  isEditingLetter, setIsEditingLetter,
  pdfFormat, setPdfFormat,
  onCopy, onPreview, onDownloadPDF, isDownloadingPDF,
}: CoverLetterCardProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          {t('aiAssistant.coverLetterGenerator')}
        </CardTitle>
        <CardDescription>{t('aiAssistant.coverLetterDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('aiAssistant.jobDescription')}</label>
          <Textarea
            placeholder={t('aiAssistant.jobDescriptionCompletePlaceholder')}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <Button
          onClick={onGenerateLetter}
          disabled={isGeneratingLetter || !jobDescription.trim()}
          className="w-full"
        >
          {isGeneratingLetter ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('aiAssistant.generating')}</>
          ) : (
            <><FileText className="w-4 h-4 mr-2" />{t('aiAssistant.generateWithAI')}</>
          )}
        </Button>

        {coverLetter && (
          <div className="space-y-3 mt-6 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{t('aiAssistant.coverLetter')}</h4>
              <Button size="sm" variant="ghost" onClick={() => setIsEditingLetter(!isEditingLetter)}>
                <Edit2 className="w-4 h-4 mr-1" />
                {isEditingLetter ? t('common.view') : t('common.edit')}
              </Button>
            </div>

            {coverLetter.split(/\s+/).length > 450 && (
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-800 flex items-start gap-2">
                <span>⚠️</span>
                <div>
                  <div className="font-semibold">{t('aiAssistant.letterTooLong')}</div>
                  <div>{t('aiAssistant.letterLengthWarning', { count: coverLetter.split(/\s+/).length })}</div>
                </div>
              </div>
            )}

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
              <label className="text-sm font-medium mb-2 block">{t('aiAssistant.pdfFormat')}</label>
              <Select value={pdfFormat} onValueChange={(v) => setPdfFormat(v as CoverLetterFormat)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{t('aiAssistant.minimal')}</span>
                      <span className="text-xs text-muted-foreground">{t('aiAssistant.minimalDescription')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="formal">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{t('aiAssistant.formal')}</span>
                      <span className="text-xs text-muted-foreground">{t('aiAssistant.formalDescription')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={onCopy} size="sm" variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-1" />{t('common.copy')}
              </Button>
              <Button onClick={onPreview} size="sm" variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />{t('common.preview')}
              </Button>
              <Button onClick={onDownloadPDF} disabled={isDownloadingPDF} size="sm" className="flex-1">
                {isDownloadingPDF ? (
                  <><Loader2 className="w-4 h-4 mr-1 animate-spin" />{t('aiAssistant.generating')}</>
                ) : (
                  <><Download className="w-4 h-4 mr-1" />{t('common.download')} PDF</>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
