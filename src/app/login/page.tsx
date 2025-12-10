'use client';

import { Login } from '@/components/auth/Login';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // Verificar si ya está autenticado
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const result = await response.json();
      
      if (result.authenticated) {
        // Si ya está autenticado, redirigir al dashboard
        router.push('/');
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleLoginSuccess = () => {
    // Redirigir al dashboard después de login exitoso
    router.push('/');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
}
