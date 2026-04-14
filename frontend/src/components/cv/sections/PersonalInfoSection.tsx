import { CVData } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PersonalInfoSectionProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

export function PersonalInfoSection({ cvData, setCvData }: PersonalInfoSectionProps) {
  const { t } = useLanguage();
  const updatePersonalInfo = (field: string, value: string) => {
    setCvData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          {t('sections.personalInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t('personalInfo.fullName')} *</Label>
            <Input
              id="fullName"
              value={cvData.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              placeholder={t('personalInfo.fullNamePlaceholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('personalInfo.email')} *</Label>
            <Input
              id="email"
              type="email"
              value={cvData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder={t('personalInfo.emailPlaceholder')}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">{t('personalInfo.phone')} *</Label>
            <Input
              id="phone"
              type="tel"
              value={cvData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder={t('personalInfo.phonePlaceholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">{t('personalInfo.location')} *</Label>
            <Input
              id="location"
              value={cvData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              placeholder={t('personalInfo.locationPlaceholder')}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">{t('personalInfo.linkedin')}</Label>
            <Input
              id="linkedin"
              value={cvData.personalInfo.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              placeholder={t('personalInfo.linkedinPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">{t('personalInfo.website')}</Label>
            <Input
              id="website"
              value={cvData.personalInfo.website || ''}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              placeholder={t('personalInfo.websitePlaceholder')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">{t('personalInfo.github')}</Label>
          <Input
            id="github"
            value={cvData.personalInfo.github || ''}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            placeholder={t('personalInfo.githubPlaceholder')}
          />
        </div>
      </CardContent>
    </Card>
  );
}
