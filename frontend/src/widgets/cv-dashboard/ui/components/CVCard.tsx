import { Button } from '@/shared/ui/button';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '@/app/providers';
import { SavedCVBackend } from '@/entities/cv/api';

interface CVCardProps {
  cv: SavedCVBackend;
  onLoad: (cv: SavedCVBackend) => void;
  onDelete: (id: string, title: string) => void;
}

export function CVCard({ cv, onLoad, onDelete }: CVCardProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
      <div className="flex-1">
        <p className="font-medium">{cv.title}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(cv.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onLoad(cv)}>
          {t('common.load')}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onDelete(cv.id, cv.title)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
