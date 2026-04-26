import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Download } from 'lucide-react';
import { useLanguage } from '@/app/providers';
import { CoverLetterFormat } from '@/shared/utils';

interface CoverLetterPreviewDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  previewUrl: string;
  pdfFormat: CoverLetterFormat;
  onDownloadPDF: () => void;
}

export function CoverLetterPreviewDialog({
  open, onOpenChange, previewUrl, pdfFormat, onDownloadPDF,
}: CoverLetterPreviewDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t('aiAssistant.previewCoverLetter')}</DialogTitle>
          <DialogDescription>
            {t('aiAssistant.format')}{' '}
            {pdfFormat === 'minimal' ? t('aiAssistant.minimal') : t('aiAssistant.formal')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {previewUrl && (
            <iframe
              src={previewUrl}
              className="w-full h-full border rounded"
              title={t('aiAssistant.pdfPreview')}
            />
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.close')}
          </Button>
          <Button onClick={() => { onOpenChange(false); onDownloadPDF(); }}>
            <Download className="w-4 h-4 mr-2" />
            {t('common.download')} PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
