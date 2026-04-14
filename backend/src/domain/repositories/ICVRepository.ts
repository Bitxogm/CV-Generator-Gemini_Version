import { CV, CVProps } from '../entities/CV';

export interface ICVRepository {
  // Buscar
  findById(id: string): Promise<CV | null>;
  findByUserId(userId: string, filters?: CVFilters): Promise<CV[]>;

  // Guardar
  save(cv: CV): Promise<CV>;

  // Actualizar
  update(id: string, data: Partial<CVProps>): Promise<CV>;

  // Eliminar
  delete(id: string): Promise<void>;
}

export interface CVFilters {
  hasJobOffer?: boolean; // CVs con oferta asociada
  search?: string; // buscar en title
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}
