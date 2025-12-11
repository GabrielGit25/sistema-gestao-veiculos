import { Car, Users, FileText, Bell, Wrench } from "lucide-react";
import { Vehicle, Driver } from "@/data/mockData";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { useAuth } from "@/contexts/AuthContext";
import { mockMaintenanceServices } from "./Maintenance";

interface DashboardProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  maintenanceServices: MaintenanceService[];
  onViewVehicle: (vehicleId: number) => void;
}



export function Dashboard({ vehicles, drivers, maintenanceServices, onViewVehicle }: DashboardProps) {
  const { user, isDriver } = useAuth();
  
  // Filtrar veículos baseado no tipo de usuário
  let filteredVehicles = vehicles;
  if (isDriver && user?.vehicleId) {
    filteredVehicles = vehicles.filter(v => v.id === user.vehicleId);
  }
  
  const vehiclesInService = filteredVehicles.filter(v => v.status === 'Em serviço');

  // Obter informações do último serviço
  const getLastServiceInfo = () => {
    if (maintenanceServices.length === 0) return null;
    
    // Encontrar o serviço mais recente ordenando por data
    const lastService = [...maintenanceServices].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    const vehicle = vehicles.find(v => v.id === lastService.vehicleId);
    
    return {
      date: lastService.date,
      vehiclePlate: lastService.vehiclePlate,
      vehicleModel: vehicle?.model || 'Desconhecido',
      serviceType: lastService.serviceType
    };
  };

  const lastServiceInfo = getLastServiceInfo();

  // Calcular motoristas disponíveis (status diferente de "Em serviço")
  const availableDrivers = drivers.filter(driver => driver.status !== 'Em serviço').length;
  
  // Dashboard cards configurada dentro do componente para acessar as variáveis
  const dashboardCards = [
    { 
      title: isDriver ? 'Meu Veículo' : 'Total de Veículos', 
      value: isDriver ? (filteredVehicles.length > 0 ? '1' : '0') : filteredVehicles.length.toString(), 
      subtitle: isDriver ? (filteredVehicles[0]?.status || 'Sem veículo') : `${vehiclesInService.length} em serviço`,
      icon: Car,
    },
    { 
      title: isDriver ? 'Meu Status' : 'Total de Motoristas', 
      value: isDriver ? (filteredVehicles.length > 0 ? 'Ativo' : 'Inativo') : drivers.length.toString(), 
      subtitle: isDriver ? (filteredVehicles[0]?.status || 'Sem veículo') : `${availableDrivers} disponíveis`,
      icon: Users,
    },
    { 
      title: 'Despesas do Mês', 
      value: 'R$ 2.450', 
      subtitle: '-12% vs mês anterior',
      icon: FileText,
    },
    { 
      title: 'Último Serviço', 
      value: lastServiceInfo ? new Date(lastServiceInfo.date).toLocaleDateString('pt-BR') : 'Nenhum', 
      subtitle: lastServiceInfo ? `${lastServiceInfo.vehiclePlate} (${lastServiceInfo.vehicleModel}) - ${lastServiceInfo.serviceType}` : 'Nenhum serviço registrado',
      icon: Wrench,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Painel de controlo</h1>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-card rounded-lg shadow-sm p-6 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 text-primary">
              <card.icon className="w-8 h-8" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">{card.title}</p>
            <p className="text-3xl font-bold mb-2">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Vehicles in Service */}
      <div className="bg-card rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Veículos em Serviço</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehiclesInService.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle}
              onClick={() => onViewVehicle(vehicle.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
