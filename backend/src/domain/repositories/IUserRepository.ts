import { User } from '../entities/User';

export interface IUserRepository {
  // Buscar
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByResetToken(token: string): Promise<User | null>;

  // Guardar
  save(user: User): Promise<User>;

  // Actualizar
  update(id: string, data: Partial<User>): Promise<User>;

  // Eliminar
  delete(id: string): Promise<void>;
}
