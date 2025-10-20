import { CVData, Language } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, Plus, Trash2 } from 'lucide-react';

interface LanguagesSectionProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

export function LanguagesSection({ cvData, setCvData }: LanguagesSectionProps) {
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'Intermedio',
    };
    setCvData({
      ...cvData,
      languages: [...(cvData.languages || []), newLanguage],
    });
  };

  const updateLanguage = (id: string, field: string, value: any) => {
    setCvData({
      ...cvData,
      languages: (cvData.languages || []).map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    });
  };

  const removeLanguage = (id: string) => {
    setCvData({
      ...cvData,
      languages: (cvData.languages || []).filter((lang) => lang.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Languages className="w-5 h-5 text-primary" />
          Idiomas
        </h3>
        <Button onClick={addLanguage} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>

      {(cvData.languages || []).map((lang, index) => (
        <Card key={lang.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Idioma {index + 1}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeLanguage(lang.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Idioma</Label>
                <Input
                  value={lang.name}
                  onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                  placeholder="Español, Inglés, Francés..."
                />
              </div>
              <div className="space-y-2">
                <Label>Nivel de Competencia</Label>
                <Select
                  value={lang.proficiency}
                  onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                    <SelectItem value="Nativo">Nativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {(cvData.languages || []).length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No hay idiomas agregados</p>
          <Button onClick={addLanguage} variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Agregar primer idioma
          </Button>
        </Card>
      )}
    </div>
  );
}
