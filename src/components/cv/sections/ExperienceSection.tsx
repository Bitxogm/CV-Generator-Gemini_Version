import { CVData, Experience } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

interface ExperienceSectionProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

export function ExperienceSection({ cvData, setCvData }: ExperienceSectionProps) {
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
          Experiencia Profesional
        </h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>

      {cvData.experience.map((exp, index) => (
        <Card key={exp.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Experiencia {index + 1}
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
                <Label>Empresa *</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Nombre de la empresa"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo *</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Desarrollador Senior"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder="Madrid, España"
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha Inicio *</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha Fin</Label>
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
                Trabajo actual
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Descripción de Responsabilidades</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="• Logro 1&#10;• Logro 2&#10;• Logro 3"
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {cvData.experience.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No hay experiencias agregadas</p>
          <Button onClick={addExperience} variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Agregar primera experiencia
          </Button>
        </Card>
      )}
    </div>
  );
}
