import { CVData, Experience } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExperienceSectionProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

export function ExperienceSection({ cvData, setCvData }: ExperienceSectionProps) {
  const { t } = useLanguage();
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setCvData({
      ...cvData,
      experience: [...cvData.experience, newExperience],
    });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.filter((exp) => exp.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          {t('sections.experience')}
        </h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          {t('common.add')}
        </Button>
      </div>

      {cvData.experience.map((exp, index) => (
        <Card key={exp.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              {t('experience.title')} {index + 1}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(exp.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('experience.company')} *</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder={t('experience.companyPlaceholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t('experience.position')} *</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder={t('experience.positionPlaceholder')}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t('experience.location')}</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder={t('experience.locationPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('experience.startDate')} *</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t('experience.endDate')}</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${exp.id}`}
                checked={exp.current}
                onCheckedChange={(checked) =>
                  updateExperience(exp.id, 'current', checked)
                }
              />
              <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">
                {t('experience.current')}
              </Label>
            </div>

            <div className="space-y-2">
              <Label>{t('experience.description')}</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder={t('experience.descriptionPlaceholder')}
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {cvData.experience.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          <p>{t('experience.noExperience')}</p>
          <Button onClick={addExperience} variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            {t('experience.addExperience')}
          </Button>
        </Card>
      )}
    </div>
  );
}
