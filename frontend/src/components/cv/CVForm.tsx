import { useState } from 'react';
import { CVData, TemplateType } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { SummarySection } from './sections/SummarySection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { SoftSkillsSection } from './sections/SoftSkillsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { LanguagesSection } from './sections/LanguagesSection';
import { FileText, Eye, Save, Layout } from 'lucide-react';

interface CVFormProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
  onPreview: () => void;
  onSave: () => void;
  templateType: TemplateType;
  setTemplateType: (type: TemplateType) => void;
}

export function CVForm({ 
  cvData, 
  setCvData, 
  onPreview, 
  onSave,
  templateType,
  setTemplateType 
}: CVFormProps) {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">Crear CV</h2>
            <p className="text-sm text-muted-foreground">
              Completa los datos para generar tu CV profesional
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
          <Button onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
        </div>
      </div>

      {/* Template Selector */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Layout className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Plantilla</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(['modern', 'professional', 'creative'] as TemplateType[]).map((type) => (
            <button
              key={type}
              onClick={() => setTemplateType(type)}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                templateType === type
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="font-medium capitalize">{type}</p>
            </button>
          ))}
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="experience">Experiencia</TabsTrigger>
          <TabsTrigger value="education">Educación</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="languages">Idiomas</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalInfoSection cvData={cvData} setCvData={setCvData} />
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <SummarySection cvData={cvData} setCvData={setCvData} />
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <ExperienceSection cvData={cvData} setCvData={setCvData} />
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <EducationSection cvData={cvData} setCvData={setCvData} />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <div className="space-y-6">
            <SkillsSection cvData={cvData} setCvData={setCvData} />
            <SoftSkillsSection cvData={cvData} setCvData={setCvData} />
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsSection cvData={cvData} setCvData={setCvData} />
        </TabsContent>

        <TabsContent value="languages" className="mt-6">
          <LanguagesSection cvData={cvData} setCvData={setCvData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
