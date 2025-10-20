import { CVData, Education } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

interface EducationSectionProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

export function EducationSection({ cvData, setCvData }: EducationSectionProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
    };
    setCvData({
      ...cvData,
      education: [...cvData.education, newEducation],
    });
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setCvData({
      ...cvData,
      education: cvData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    setCvData({
      ...cvData,
      education: cvData.education.filter((edu) => edu.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Educación
        </h3>
        <Button onClick={addEducation} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>

      {cvData.education.map((edu, index) => (
        <Card key={edu.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Educación {index + 1}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Institución *</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="Universidad Complutense de Madrid"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Grado, Máster, Doctorado"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Campo de Estudio *</Label>
                <Input
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Ingeniería Informática"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Nota Media (Opcional)</Label>
                <Input
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.8/4.0 o 8.5/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha Inicio *</Label>
                <Input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha Fin</Label>
                <Input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  disabled={edu.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-edu-${edu.id}`}
                checked={edu.current}
                onCheckedChange={(checked) =>
                  updateEducation(edu.id, 'current', checked)
                }
              />
              <Label htmlFor={`current-edu-${edu.id}`} className="text-sm font-normal">
                Actualmente cursando
              </Label>
            </div>
          </CardContent>
        </Card>
      ))}

      {cvData.education.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No hay educación agregada</p>
          <Button onClick={addEducation} variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Agregar primera educación
          </Button>
        </Card>
      )}
    </div>
  );
}
