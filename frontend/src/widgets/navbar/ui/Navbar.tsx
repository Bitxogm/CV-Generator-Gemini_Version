import { useNavigate } from 'react-router-dom';
import { LogOut, User, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/entities/user/model';
import { authService } from '@/entities/user/api';
import { toast } from 'sonner';

import ThemeToggle from '@/shared/ui/ThemeToggle';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success('Sesión cerrada', {
        description: 'Has cerrado sesión correctamente',
      });
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.prompt(
      '⚠️ ¿Estás seguro de que quieres eliminar tu cuenta?\n\n' +
      'Esta acción es IRREVERSIBLE y eliminará:\n' +
      '• Todos tus CVs guardados\n' +
      '• Tu información de perfil\n' +
      '• Todo tu historial\n\n' +
      'Escribe "ELIMINAR" para confirmar:'
    );

    if (confirmDelete !== 'ELIMINAR') {
      return;
    }

    try {
      await authService.deleteAccount();
      logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
      alert('Error al eliminar la cuenta. Inténtalo de nuevo.');
    }
  };

  if (!isAuthenticated || !user) {
    return null; // No mostrar navbar si no está autenticado
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">CV Crafter</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span className="font-medium">{user.username}</span>
          </div>

          <ThemeToggle />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteAccount}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar Cuenta
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </nav>
  );
}