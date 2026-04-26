import { CVData, TemplateType } from '@/entities/cv/model';
import { ModernTemplate } from './templates/ModernTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';

interface CVPreviewProps {
  data: CVData;
  template: TemplateType;
  language?: 'es' | 'en';
}

export function CVPreview({ data, template, language = 'es' }: CVPreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} language={language} />;
      case 'professional':
        return <ProfessionalTemplate data={data} language={language} />;
      case 'creative':
        return <CreativeTemplate data={data} language={language} />;
      default:
        return <ModernTemplate data={data} language={language} />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {renderTemplate()}
    </div>
  );
}
