// User types
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'MEMBER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Exportar también tipos de CV
export * from './cv';