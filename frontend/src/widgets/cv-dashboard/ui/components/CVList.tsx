import { useLanguage } from '@/app/providers';
import { SavedCVBackend } from '@/entities/cv/api';
import { CVCard } from './CVCard';
import { EmptyState } from './EmptyState';

interface CVListProps {
  savedCVs: SavedCVBackend[];
  onLoad: (cv: SavedCVBackend) => void;
  onDelete: (id: string, title: string) => void;
}

export function CVList({ savedCVs, onLoad, onDelete }: CVListProps) {
  const { t } = useLanguage();

  if (savedCVs.length === 0) {
    return <EmptyState message={t('history.empty')} />;
  }

  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
      {savedCVs.map(cv => (
        <CVCard key={cv.id} cv={cv} onLoad={onLoad} onDelete={onDelete} />
      ))}
    </div>
  );
}
