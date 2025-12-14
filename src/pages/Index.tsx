import { useState, useEffect } from "react";
import { Sidebar, navItems } from "@/components/layout/Sidebar";
import { Dashboard } from "@/pages/Dashboard";
import { Vehicles } from "@/pages/Vehicles";
import { Drivers } from "@/pages/Drivers";
import { Itinerary } from "@/pages/Itinerary";
import { Maintenance } from "@/pages/Maintenance";
import { Alerts } from "@/pages/Alerts";
import { Infractions, VehicleInfraction } from "@/pages/Infractions";
import { Vehicle, Driver, VehicleAlert, initialVehicles, initialDrivers, initialAlerts } from "@/data/mockData";
import { MaintenanceService, mockMaintenanceServices } from "./Maintenance";
import { useAuth } from "@/contexts/AuthContext";
import Login from "./Login";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [maintenanceServices, setMaintenanceServices] = useState<MaintenanceService[]>(mockMaintenanceServices);
  const [alerts, setAlerts] = useState<VehicleAlert[]>(initialAlerts);
  const [infractions, setInfractions] = useState<VehicleInfraction[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);

  const handleDeleteVehicle = (vehicleId: number) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    setSelectedVehicleId(prev => (prev === vehicleId ? null : prev));
  };

  const handleDeleteDriver = (driverId: number) => {
    setDrivers(prev => prev.filter(d => d.id !== driverId));
    setSelectedDriverId(prev => (prev === driverId ? null : prev));
  };

  useEffect(() => {
    if (user?.role === 'driver' && currentPage === 'dashboard') {
      setCurrentPage('alerts');
    }
  }, [user?.role, currentPage]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedVehicleId(null);
    setSelectedDriverId(null);
  };

  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  };

  const handleUpdateDriver = (updatedDriver: Driver) => {
    setDrivers(drivers.map(d => d.id === updatedDriver.id ? updatedDriver : d));
  };

  const handleUpdateMaintenanceServices = (services: MaintenanceService[]) => {
    setMaintenanceServices(services);
  };

  const handleUpdateAlerts = (updatedAlerts: VehicleAlert[]) => {
    setAlerts(updatedAlerts);
  };

  const handleUpdateInfractions = (updated: VehicleInfraction[]) => {
    setInfractions(updated);
  };

  const getExpiredAlertsCount = () => {
    const today = new Date();
    return alerts.filter(alert => 
      alert.status !== 'concluido' && 
      new Date(alert.dataExpiracao) < today
    ).length;
  };

  const handleAddVehicle = () => {
    const newVehicle: Vehicle = {
      id: Math.max(...vehicles.map(v => v.id)) + 1,
      placa: 'NOVA000',
      modelo: '',
      marca: 'RENAULT',
      estado: 'São Paulo',
      motorista: '-',
      status: 'Em serviço',
      quilometragem: '0',
      combustivel: 'Diesel',
      ano: new Date().getFullYear(),
      tipoVeiculo: 'van',
      tipoCarroceria: 'van',
      capacidade: '1000kg',
      condicao: 'proprio',
      dataAquisicao: new Date().toISOString().split('T')[0],
      cor: 'Branco',
      potencia: '75 CV',
      estadoUF: 'SP',
      imageSrc: null
    };
    setVehicles([...vehicles, newVehicle]);
    setSelectedVehicleId(newVehicle.id);
  };

  const handleAddDriver = () => {
    const newDriver: Driver = {
      id: Math.max(...drivers.map(d => d.id)) + 1,
      nome: 'Novo Motorista',
      cpf: '',
      cnh: '',
      categoriaCNH: 'B',
      validadeCNH: '',
      dataNascimento: '',
      telefone: '',
      email: '',
      endereco: '',
      bairro: '',
      cidade: '',
      estado: 'SP',
      cep: '',
      veiculo: '-',
      status: 'Disponível',
      imageSrc: null
    };
    setDrivers([...drivers, newDriver]);
    setSelectedDriverId(newDriver.id);
  };

  const handleViewVehicle = (vehicleId: number) => {
    setCurrentPage('vehicles');
    setSelectedVehicleId(vehicleId);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return user?.role === 'driver' ? (
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-4">Acesso não permitido</h1>
            <p className="text-muted-foreground">O Painel de Controle está disponível apenas para administradores.</p>
          </div>
        ) : (
          <Dashboard 
            vehicles={vehicles}
            drivers={drivers}
            maintenanceServices={maintenanceServices}
            onViewVehicle={handleViewVehicle}
          />
        );
      case 'vehicles':
        return (
          <Vehicles 
            vehicles={vehicles}
            onUpdateVehicle={handleUpdateVehicle}
            onAddVehicle={handleAddVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
          />
        );
      case 'drivers':
        return (
          <Drivers 
            drivers={drivers}
            onUpdateDriver={handleUpdateDriver}
            onAddDriver={handleAddDriver}
            onDeleteDriver={handleDeleteDriver}
            selectedDriverId={selectedDriverId}
            onSelectDriver={setSelectedDriverId}
          />
        );
      case 'itinerary':
        return (
          <Itinerary 
            vehicles={vehicles}
          />
        );
      case 'maintenance':
        return (
          <Maintenance 
            vehicles={vehicles}
            maintenanceServices={maintenanceServices}
            onUpdateMaintenanceServices={handleUpdateMaintenanceServices}
          />
        );
      case 'alerts':
        return (
          <Alerts 
            alerts={alerts}
            onUpdateAlerts={handleUpdateAlerts}
          />
        );
      case 'infractions':
        return (
          <Infractions
            infractions={infractions}
            onUpdateInfractions={handleUpdateInfractions}
          />
        );
      default:
        return (
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-4">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h1>
            <p className="text-muted-foreground">Página em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        expiredAlertsCount={getExpiredAlertsCount()}
      />

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar text-sidebar-foreground flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 border-2 border-sidebar-foreground rounded-full flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">GestãoVeículos</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-sidebar text-sidebar-foreground">
            <div className="bg-sidebar text-sidebar-foreground h-16 flex items-center px-6 border-b border-sidebar-border">
              <span className="text-lg font-semibold">Menu</span>
            </div>
            <nav className="p-4 space-y-1">
              {navItems(getExpiredAlertsCount())
                .filter((item) => (user?.role === 'driver' ? !['dashboard', 'drivers'].includes(item.id) : true))
                .map((item) => (
                <SheetClose asChild key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={"nav-link w-full"}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </SheetClose>
              ))}
            </nav>
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
              <SheetClose asChild>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground/90 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                >
                  Sair
                </button>
              </SheetClose>
              <p className="text-xs opacity-50 leading-relaxed mt-3">
                © GestãoVeículos 2025<br />
                Todos os direitos reservados
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <main className="md:ml-64 ml-0 flex-1 bg-background p-8 pt-24 md:pt-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
