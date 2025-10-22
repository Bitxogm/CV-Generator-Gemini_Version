import { CVData, Project } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FolderGit2, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectsSectionProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

export function ProjectsSection({ cvData, setCvData }: ProjectsSectionProps) {
  const { t } = useLanguage();
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
    };
    setCvData({
      ...cvData,
      projects: [...(cvData.projects || []), newProject],
    });
  };

  const updateProject = (id: string, field: string, value: any) => {
    setCvData({
      ...cvData,
      projects: (cvData.projects || []).map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const removeProject = (id: string) => {
    setCvData({
      ...cvData,
      projects: (cvData.projects || []).filter((proj) => proj.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-primary" />
          {t('sections.projects')}
        </h3>
        <Button onClick={addProject} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          {t('common.add')}
        </Button>
      </div>

      {(cvData.projects || []).map((proj, index) => (
        <Card key={proj.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              {t('projects.title')} {index + 1}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeProject(proj.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('projects.name')}</Label>
                <Input
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                  placeholder={t('projects.namePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('projects.url')} ({t('common.optional')})</Label>
                <Input
                  value={proj.link || ''}
                  onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                  placeholder={t('projects.urlPlaceholder')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('projects.description')}</Label>
              <Textarea
                value={proj.description}
                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                placeholder={t('projects.descriptionPlaceholder')}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>{t('projects.technologies')}</Label>
              <Input
                value={proj.technologies.join(', ')}
                onChange={(e) =>
                  updateProject(
                    proj.id,
                    'technologies',
                    e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                  )
                }
                placeholder={t('projects.technologiesPlaceholder')}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {(cvData.projects || []).length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          <p>{t('projects.noProjects')}</p>
          <Button onClick={addProject} variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            {t('projects.addProject')}
          </Button>
        </Card>
      )}
    </div>
  );
}
