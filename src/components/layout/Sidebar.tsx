import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Gauge, 
  FileText, 
  Wrench, 
  Bell,
  AlertTriangle,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  expiredAlertsCount?: number;
}

export const navItems = (expiredAlertsCount: number = 0) => [
  { id: 'dashboard', label: 'Painel de Controle', icon: LayoutDashboard },
  { id: 'vehicles', label: 'Veículos', icon: Car },
  { id: 'drivers', label: 'Motoristas', icon: Users },
  { id: 'maintenance', label: 'Manutenção', icon: Wrench },
  { id: 'itinerary', label: 'Itinerário', icon: FileText },
  { 
    id: 'alerts', 
    label: 'Alertas', 
    icon: Bell, 
    badge: expiredAlertsCount > 0 ? `${expiredAlertsCount} Ver` : undefined 
  },
  { id: 'infractions', label: 'Infrações', icon: AlertTriangle },
];

export function Sidebar({ currentPage, onNavigate, expiredAlertsCount = 0 }: SidebarProps) {
  const { user, logout, isDriver } = useAuth();
  return (
    <aside className="hidden md:flex fixed left-0 top-0 w-64 h-screen bg-sidebar text-sidebar-foreground flex-col z-40">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 border-2 border-sidebar-foreground rounded-full flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">GestãoVeículos</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems(expiredAlertsCount)
          .filter((item) => (isDriver ? !['dashboard', 'drivers'].includes(item.id) : true))
          .map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "nav-link w-full",
              currentPage === item.id && "active"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center font-semibold">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.username}</p>
            <span className="text-xs opacity-70">{user?.role === 'admin' ? 'Administrador' : 'Motorista'}</span>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
        
        <p className="text-xs opacity-50 leading-relaxed mt-3">
          © GestãoVeículos 2025<br />
          Todos os direitos reservados
        </p>
      </div>
    </aside>
  );
}
