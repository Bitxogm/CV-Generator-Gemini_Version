import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-blue-500/10 dark:from-violet-900/25 dark:to-blue-900/25 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            TalentHub
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tu CV profesional con IA
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}