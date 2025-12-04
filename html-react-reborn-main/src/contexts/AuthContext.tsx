import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: number;
  username: string;
  password: string;
  type: 'admin' | 'driver';
  driverId?: number; // ID do motorista associado (se for motorista)
  vehicleId?: number; // ID do veículo associado (se for motorista)
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDriver: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários mockados (em produção, isso viria de uma API)
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    type: 'admin'
  },
  {
    id: 2,
    username: 'joao',
    password: 'motorista123',
    type: 'driver',
    driverId: 1, // João Silva
    vehicleId: 1 // Veículo SGF1525
  },
  {
    id: 3,
    username: 'maria',
    password: 'motorista123',
    type: 'driver',
    driverId: 2, // Maria Santos
    vehicleId: 2 // Veículo ABC1234
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Verificar se há usuário salvo no localStorage ao inicializar
  useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  });

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.type === 'admin',
    isDriver: user?.type === 'driver'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};