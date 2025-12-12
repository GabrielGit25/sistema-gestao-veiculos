import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Vehicle } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleDetails } from "@/components/vehicles/VehicleDetails";
import { useAuth } from "@/contexts/AuthContext";

interface VehiclesProps {
  vehicles: Vehicle[];
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onAddVehicle: () => void;
  onDeleteVehicle: (vehicleId: number) => void;
  selectedVehicleId: number | null;
  onSelectVehicle: (vehicleId: number | null) => void;
}

export function Vehicles({ 
  vehicles, 
  onUpdateVehicle, 
  onAddVehicle, 
  onDeleteVehicle,
  selectedVehicleId, 
  onSelectVehicle 
}: VehiclesProps) {
  const { user, isDriver } = useAuth();
  
  // Filtrar veículos baseado no tipo de usuário
  let filteredVehicles = vehicles;
  if (isDriver && user?.vehicleId) {
    filteredVehicles = vehicles.filter(v => v.id === user.vehicleId);
  }
  
  const selectedVehicle = filteredVehicles.find(v => v.id === selectedVehicleId);

  if (selectedVehicle) {
    return (
      <VehicleDetails 
        vehicle={selectedVehicle}
        onBack={() => onSelectVehicle(null)}
        onUpdate={onUpdateVehicle}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Veículos</h1>
        {!isDriver && (
          <Button onClick={onAddVehicle}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar veículo
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="relative">
            <VehicleCard 
              vehicle={vehicle}
              onClick={() => onSelectVehicle(vehicle.id)}
            />
            {!isDriver && (
              <div className="absolute top-2 left-2">
                <Button variant="destructive" size="icon" onClick={() => onDeleteVehicle(vehicle.id)}>
                  <X className="w-4 h-4 text-white" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
