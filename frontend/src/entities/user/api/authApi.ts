import axios from '@/shared/api';
import { ApiResponse, getResponseData } from '@/shared/api';
import { User, LoginData, RegisterData, AuthResponse } from '@/entities/user/model';

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post<ApiResponse<AuthResponse>>('/auth/signup', data);
    return getResponseData(response);
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post<ApiResponse<AuthResponse>>('/auth/signin', data);
    return getResponseData(response);
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<User> {
    const response = await axios.get<ApiResponse<User>>('/auth/me');
    return getResponseData(response);
  }

  async deleteAccount(): Promise<void> {
    const response = await axios.delete('/auth/account');
    localStorage.removeItem('auth-storage');
    return response.data;
  }
}

export const authService = new AuthService();
export default authService;
