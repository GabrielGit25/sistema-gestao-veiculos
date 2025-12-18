import { Vehicle } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Em serviço':
        return 'status-em-servico';
      case 'Em manutenção':
        return 'status-em-manutencao';
      case 'Fora de serviço':
        return 'status-fora-de-servico';
      default:
        return 'status-em-servico';
    }
  };

  return (
    <div 
      className="bg-card rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
      onClick={onClick}
    >
      <div className="h-32 bg-secondary relative">
        {vehicle.imageSrc ? (
          <img 
            src={vehicle.imageSrc} 
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span>Sem imagem</span>
          </div>
        )}
        <span className={cn("absolute top-3 right-3 status-badge", getStatusClass(vehicle.status))}>
          {vehicle.status}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{vehicle.placa}</h3>
        <p className="text-sm text-muted-foreground mb-2">{vehicle.marca} {vehicle.modelo}</p>
        <div className="flex justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Motorista</span>
            <span className="text-sm font-medium">{vehicle.motorista}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Quilometragem</span>
            <span className="text-sm font-medium">{vehicle.quilometragem} km</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Combustível:</span>
          <span className="vehicle-badge">{vehicle.combustivel}</span>
          <span className="text-sm font-medium">Ano: {vehicle.ano}</span>
        </div>
      </div>
    </div>
  );
}
