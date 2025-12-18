import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'driver';
  vehicleId?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isDriver: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    // Simulação simples de autenticação
    // Em uma aplicação real, isso seria uma chamada API
    if (username === 'admin' && password === 'admin123') {
      const userData: User = {
        id: 1,
        username: 'admin',
        role: 'admin'
      };
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } else if (username === 'joao' && password === 'motorista123') {
      const userData: User = {
        id: 2,
        username: 'joao',
        role: 'driver',
        vehicleId: 1 // ID do veículo associado ao motorista João
      };
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } else if (username === 'maria' && password === 'motorista123') {
      const userData: User = {
        id: 3,
        username: 'maria',
        role: 'driver',
        vehicleId: 2 // ID do veículo associado ao motorista Maria
      };
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isDriver: user?.role === 'driver',
    isAdmin: user?.role === 'admin',
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}