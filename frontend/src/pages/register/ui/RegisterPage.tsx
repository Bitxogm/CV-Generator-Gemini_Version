import { RegisterForm } from '@/features/auth/register';
import { AuthBackground } from '@/shared/ui/AuthBackground';

export default function Register() {
  return (
    <AuthBackground>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TalentHub
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Crea tu cuenta y empieza a destacar
          </p>
        </div>
        <RegisterForm />
      </div>
    </AuthBackground>
  );
}