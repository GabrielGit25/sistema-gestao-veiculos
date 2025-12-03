import { Plus } from "lucide-react";
import { Driver } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { DriverCard } from "@/components/drivers/DriverCard";
import { DriverDetails } from "@/components/drivers/DriverDetails";

interface DriversProps {
  drivers: Driver[];
  onUpdateDriver: (driver: Driver) => void;
  onAddDriver: () => void;
  selectedDriverId: number | null;
  onSelectDriver: (driverId: number | null) => void;
}

export function Drivers({ 
  drivers, 
  onUpdateDriver, 
  onAddDriver, 
  selectedDriverId, 
  onSelectDriver 
}: DriversProps) {
  const selectedDriver = drivers.find(d => d.id === selectedDriverId);

  if (selectedDriver) {
    return (
      <DriverDetails 
        driver={selectedDriver}
        onBack={() => onSelectDriver(null)}
        onUpdate={onUpdateDriver}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Motoristas</h1>
        <Button onClick={onAddDriver}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar motorista
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {drivers.map((driver) => (
          <DriverCard 
            key={driver.id} 
            driver={driver}
            onClick={() => onSelectDriver(driver.id)}
          />
        ))}
      </div>
    </div>
  );
}
