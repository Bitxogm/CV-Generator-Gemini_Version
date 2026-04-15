import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

/**
 * Estado de autenticación
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Acciones de autenticación
 */
interface AuthActions {
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

/**
 * Store de autenticación con Zustand
 * Persiste automáticamente en localStorage
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      /**
       * Establecer usuario y token (después de login/register)
       */
      setAuth: (user: User, token: string) => {
        // Guardar token en localStorage también (para axios interceptor)
        localStorage.setItem('token', token);
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      /**
       * Cerrar sesión
       */
      logout: () => {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      /**
       * Cambiar estado de carga
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * Actualizar datos del usuario (sin cambiar token)
       */
      updateUser: (updatedData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage', // Nombre en localStorage
      // Solo persistir user y token (no isLoading)
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Hooks selectores para un mejor performance
 */
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);