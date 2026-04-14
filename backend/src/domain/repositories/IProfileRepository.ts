import { Profile } from '../entities/Profile';

export interface IProfileRepository {
  // Buscar
  findById(id: string): Promise<Profile | null>;
  findByUserId(userId: string): Promise<Profile | null>;
  findAll(filters?: ProfileFilters): Promise<Profile[]>;

  // Guardar
  save(profile: Profile): Promise<Profile>;

  // Actualizar
  update(id: string, data: Partial<Profile>): Promise<Profile>;

  // Incrementar vistas
  incrementViews(id: string): Promise<void>;

  // Eliminar
  delete(id: string): Promise<void>;
}

export interface ProfileFilters {
  isPublic?: boolean;
  skills?: string[];
  search?: string; // buscar en fullName o title
  limit?: number;
  offset?: number;
}
