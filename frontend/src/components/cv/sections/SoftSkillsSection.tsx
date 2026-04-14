import { useState } from 'react';
import { CVData } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SoftSkillsSectionProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

export function SoftSkillsSection({ cvData, setCvData }: SoftSkillsSectionProps) {
  const { t } = useLanguage();
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      setCvData({
        ...cvData,
        softSkills: [...(cvData.softSkills || []), newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setCvData({
      ...cvData,
      softSkills: (cvData.softSkills || []).filter((_, i) => i !== index),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          {t('sections.softSkills')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('softSkills.skillPlaceholder')}
          />
          <Button onClick={addSkill} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(cvData.softSkills || []).map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-3 py-1.5 text-sm cursor-pointer hover:bg-destructive/10 transition-colors group border-primary/30"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="ml-2 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>

        {(!cvData.softSkills || cvData.softSkills.length === 0) && (
          <p className="text-center text-muted-foreground py-4">
            {t('softSkills.noSkills')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
