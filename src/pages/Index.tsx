import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/pages/Dashboard";
import { Vehicles } from "@/pages/Vehicles";
import { Drivers } from "@/pages/Drivers";
import { Itinerary } from "@/pages/Itinerary";
import { Maintenance } from "@/pages/Maintenance";
import { Alerts } from "@/pages/Alerts";
import { Vehicle, Driver, VehicleAlert, initialVehicles, initialDrivers, initialAlerts } from "@/data/mockData";
import { MaintenanceService, mockMaintenanceServices } from "./Maintenance";
import { useAuth } from "@/contexts/AuthContext";
import Login from "./Login";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [maintenanceServices, setMaintenanceServices] = useState<MaintenanceService[]>(mockMaintenanceServices);
  const [alerts, setAlerts] = useState<VehicleAlert[]>(initialAlerts);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);

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
        return (
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
      <main className="ml-64 flex-1 p-8 bg-background">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
