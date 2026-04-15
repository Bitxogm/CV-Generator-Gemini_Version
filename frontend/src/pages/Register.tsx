import RegisterForm from '@/components/auth/RegisterForm';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            TalentHub
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Crea tu cuenta y empieza a destacar
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}