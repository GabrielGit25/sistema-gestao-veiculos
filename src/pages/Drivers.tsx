import { Plus, X } from "lucide-react";
import { Driver } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { DriverCard } from "@/components/drivers/DriverCard";
import { DriverDetails } from "@/components/drivers/DriverDetails";
import { useAuth } from "@/contexts/AuthContext";

interface DriversProps {
  drivers: Driver[];
  onUpdateDriver: (driver: Driver) => void;
  onAddDriver: () => void;
  onDeleteDriver: (driverId: number) => void;
  selectedDriverId: number | null;
  onSelectDriver: (driverId: number | null) => void;
}

export function Drivers({ 
  drivers, 
  onUpdateDriver, 
  onAddDriver, 
  onDeleteDriver,
  selectedDriverId, 
  onSelectDriver 
}: DriversProps) {
  const { isDriver } = useAuth();
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
        {!isDriver && (
          <Button onClick={onAddDriver}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar motorista
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {drivers.map((driver) => (
          <div key={driver.id} className="relative">
            <DriverCard 
              driver={driver}
              onClick={() => onSelectDriver(driver.id)}
            />
            {!isDriver && (
              <div className="absolute top-2 left-2">
                <Button variant="destructive" size="icon" onClick={() => onDeleteDriver(driver.id)}>
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
