import { useState } from "react";
import { Plus } from "lucide-react";
import { Vehicle } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleDetails } from "@/components/vehicles/VehicleDetails";

interface VehiclesProps {
  vehicles: Vehicle[];
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onAddVehicle: () => void;
  selectedVehicleId: number | null;
  onSelectVehicle: (vehicleId: number | null) => void;
}

export function Vehicles({ 
  vehicles, 
  onUpdateVehicle, 
  onAddVehicle, 
  selectedVehicleId, 
  onSelectVehicle 
}: VehiclesProps) {
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

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
        <Button onClick={onAddVehicle}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar veículo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard 
            key={vehicle.id} 
            vehicle={vehicle}
            onClick={() => onSelectVehicle(vehicle.id)}
          />
        ))}
      </div>
    </div>
  );
}
