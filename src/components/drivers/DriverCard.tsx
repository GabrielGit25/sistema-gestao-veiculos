import { Driver } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface DriverCardProps {
  driver: Driver;
  onClick: () => void;
}

export function DriverCard({ driver, onClick }: DriverCardProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Disponível':
        return 'status-available';
      case 'Em serviço':
        return 'status-driving';
      case 'Fora de serviço':
        return 'status-off';
      default:
        return 'status-available';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div 
      className="bg-card rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
      onClick={onClick}
    >
      <div className="h-32 bg-secondary relative">
        {driver.imageSrc ? (
          <img 
            src={driver.imageSrc} 
            alt={driver.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span>Sem foto</span>
          </div>
        )}
        <span className={cn("absolute top-3 right-3 status-badge", getStatusClass(driver.status))}>
          {driver.status}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{driver.nome}</h3>
        <div className="flex justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Telefone</span>
            <span className="text-sm font-medium">{driver.telefone}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Veículo</span>
            <span className="text-sm font-medium">{driver.veiculo}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">CNH:</span>
          <span className="license-badge">{driver.categoriaCNH}</span>
          <span className="text-sm font-medium">Validade: {formatDate(driver.validadeCNH)}</span>
        </div>
      </div>
    </div>
  );
}
