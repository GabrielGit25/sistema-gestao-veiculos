import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Gauge, 
  FileText, 
  Wrench, 
  Bell 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Painel de controlo', icon: LayoutDashboard },
  { id: 'vehicles', label: 'Veículos', icon: Car },
  { id: 'drivers', label: 'Motoristas', icon: Users },
  { id: 'mileage', label: 'Quilometragem', icon: Gauge },
  { id: 'expenses', label: 'Despesas', icon: FileText },
  { id: 'maintenance', label: 'Manutenção', icon: Wrench },
  { id: 'alerts', label: 'Alertas', icon: Bell, badge: '5 Ver' },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-sidebar text-sidebar-foreground flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 border-2 border-sidebar-foreground rounded-full flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">FleetMax</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
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
            FM
          </div>
          <div>
            <p className="text-sm font-medium">FleetMax Demo</p>
            <span className="text-xs opacity-70">Administrador</span>
          </div>
        </div>
        <p className="text-xs opacity-50 leading-relaxed">
          © FleetMT 2023<br />
          Todos os direitos reservados
        </p>
      </div>
    </aside>
  );
}
