import axios from '@/lib/axios';
import { ApiResponse, getResponseData } from '@/lib/axios';
import { 
  User, 
  LoginData, 
  RegisterData, 
  AuthResponse 
} from '@/types';

/**
 * Servicio de Autenticación
 * Maneja todas las peticiones relacionadas con auth
 */
class AuthService {
  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post<ApiResponse<AuthResponse>>('/auth/signup', data);
    return getResponseData(response);
  }

  /**
   * Iniciar sesión
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post<ApiResponse<AuthResponse>>('/auth/signin', data);
    return getResponseData(response);
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    // Limpiar token del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Obtener usuario actual
   */
  async getCurrentUser(): Promise<User> {
    const response = await axios.get<ApiResponse<User>>('/auth/me');
    return getResponseData(response);
  }

   async deleteAccount(): Promise<void> {
    const response = await axios.delete('/auth/account');
    
    // Limpiar localStorage
    localStorage.removeItem('auth-storage');
    
    return response.data;
  }
}

export const authService = new AuthService();
export default authService;