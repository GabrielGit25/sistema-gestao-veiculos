import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'driver';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isDriver } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  if (requiredRole === 'driver' && !isDriver) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;