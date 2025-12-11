import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Wrench, 
  Download,
  Filter,
  Search,
  Edit,
  X,
  User,
  Upload
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface MaintenanceService {
  id: number;
  vehicleId: number;
  vehiclePlate: string;
  serviceType: string;
  serviceDescription: string;
  location: string;
  date: string;
  cost: number;
  technician: string;
  attachment?: string;
  notes?: string;
}

// Dados mockados para histórico de manutenção
export const mockMaintenanceServices: MaintenanceService[] = [
  {
    id: 1,
    vehicleId: 1,
    vehiclePlate: 'SGF1525',
    serviceType: 'Troca de óleo',
    serviceDescription: 'Troca de óleo do motor e filtro',
    location: 'Oficina Central - São Paulo',
    date: '2024-01-15',
    cost: 350.00,
    technician: 'Carlos Silva',
    attachment: 'https://picsum.photos/seed/manutencao1/400/300',
    notes: 'Veículo apresentou bom desempenho após a manutenção'
  },
  {
    id: 2,
    vehicleId: 1,
    vehiclePlate: 'SGF1525',
    serviceType: 'Revisão dos freios',
    serviceDescription: 'Substituição das pastilhas de freio dianteiras',
    location: 'Oficina Express - Campinas',
    date: '2024-02-20',
    cost: 620.00,
    technician: 'Ana Santos',
    attachment: 'https://picsum.photos/seed/manutencao2/400/300',
    notes: 'Freios substituídos com sucesso'
  },
  {
    id: 3,
    vehicleId: 2,
    vehiclePlate: 'ABC1234',
    serviceType: 'Alinhamento e balanceamento',
    serviceDescription: 'Alinhamento 3D e balanceamento das rodas',
    location: 'Centro Automotivo - Rio de Janeiro',
    date: '2024-03-10',
    cost: 280.00,
    technician: 'Roberto Alves',
    notes: 'Veículo alinhado conforme especificações do fabricante'
  },
  {
    id: 4,
    vehicleId: 1,
    vehiclePlate: 'SGF1525',
    serviceType: 'Troca de pneus',
    serviceDescription: 'Substituição dos 4 pneus',
    location: 'Pneus & Cia - São Paulo',
    date: '2024-04-05',
    cost: 1850.00,
    technician: 'Miguel Costa',
    notes: 'Agendado para próxima semana'
  },
  {
    id: 5,
    vehicleId: 2,
    vehiclePlate: 'ABC1234',
    serviceType: 'Manutenção preventiva',
    serviceDescription: 'Revisão completa do veículo',
    location: 'Oficina Master - Belo Horizonte',
    date: '2024-04-18',
    cost: 1200.00,
    technician: 'Paula Rodrigues',
    notes: 'Aguardando peças'
  }
];

interface MaintenanceProps {
  vehicles: {
    id: number;
    plate: string;
    model: string;
    status: string;
    motorista?: string;
    vehicleId?: number;
  }[];
  maintenanceServices: MaintenanceService[];
  onUpdateMaintenanceServices: (services: MaintenanceService[]) => void;
}

export function Maintenance({ vehicles, maintenanceServices, onUpdateMaintenanceServices }: MaintenanceProps) {
  const { user, isDriver } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<MaintenanceService | null>(null);
  
  // Estado para o formulário
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: '',
    serviceDescription: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    technician: '',
    attachment: '',
    notes: ''
  });

  // Estado para erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtrar serviços baseado no tipo de usuário e ordenar por data (mais recente primeiro)
  const filteredServices = maintenanceServices
    .filter(service => {
      const matchesSearch = service.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.technician.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (isDriver && user?.vehicleId) {
        return service.vehicleId === user.vehicleId && matchesSearch;
      }
      
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    // Corrige o problema do fuso horário adicionando meio-dia
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };



  // Funções para manipular o formulário
  const handleOpenDialog = (service?: MaintenanceService) => {
    if (service) {
      setEditingService(service);
      setFormData({
        vehicleId: service.vehicleId.toString(),
        serviceType: service.serviceType,
        serviceDescription: service.serviceDescription,
        location: service.location,
        date: service.date,
        cost: service.cost.toString(),
        technician: service.technician,
        attachment: service.attachment || '',
        notes: service.notes || ''
      });
    } else {
      setEditingService(null);
      setFormData({
        vehicleId: '',
        serviceType: '',
        serviceDescription: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        cost: '',
        technician: '',
        attachment: '',
        notes: ''
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    const newErrors: Record<string, string> = {};
    
    if (!formData.vehicleId) newErrors.vehicleId = 'Veículo é obrigatório';
    if (!formData.serviceType.trim()) newErrors.serviceType = 'Tipo de serviço é obrigatório';
    if (!formData.serviceDescription.trim()) newErrors.serviceDescription = 'Descrição do serviço é obrigatória';
    if (!formData.location.trim()) newErrors.location = 'Local é obrigatório';
    if (!formData.date) newErrors.date = 'Data é obrigatória';
    if (!formData.cost || parseFloat(formData.cost) <= 0) newErrors.cost = 'Custo deve ser maior que zero';
    if (!formData.technician.trim()) newErrors.technician = 'Motorista é obrigatório';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    const serviceData = {
      id: editingService ? editingService.id : Math.max(...maintenanceServices.map(s => s.id), 0) + 1,
      vehicleId: parseInt(formData.vehicleId),
      vehiclePlate: vehicles.find(v => v.id === parseInt(formData.vehicleId))?.plate || '',
      serviceType: formData.serviceType,
      serviceDescription: formData.serviceDescription,
      location: formData.location,
      date: formData.date,
      cost: parseFloat(formData.cost),
      technician: formData.technician,
      attachment: formData.attachment || undefined,
      notes: formData.notes || undefined
    };

    if (editingService) {
      // Atualizar serviço existente e reordenar a lista
      const updatedServices = maintenanceServices.map(s => s.id === editingService.id ? serviceData : s);
      const sortedServices = updatedServices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onUpdateMaintenanceServices(sortedServices);
    } else {
      // Adicionar novo serviço e reordenar a lista
      const updatedServices = [...maintenanceServices, serviceData];
      const sortedServices = updatedServices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onUpdateMaintenanceServices(sortedServices);
    }

    handleCloseDialog();
  };

  const handleDeleteService = (id: number) => {
    onUpdateMaintenanceServices(maintenanceServices.filter(s => s.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Histórico de Manutenção</h1>
          <p className="text-muted-foreground">
            Registro completo de todos os serviços realizados na frota
          </p>
        </div>
        
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Busca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por placa, serviço ou técnico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredServices.length}</div>
            <p className="text-xs text-muted-foreground">serviços realizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(filteredServices.reduce((total, service) => total + service.cost, 0))}
            </div>
            <p className="text-xs text-muted-foreground">investido em manutenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Último Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {filteredServices.length > 0 ? formatDate(filteredServices[0].date) : 'Nenhum'}
            </div>
            <p className="text-xs text-muted-foreground">data do último serviço</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de serviços */}
      <div className="space-y-4">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{service.serviceType}</h3>
                      <p className="text-sm text-muted-foreground">{service.serviceDescription}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(service)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteService(service.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(service.date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{service.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{service.technician}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-medium">{service.vehiclePlate}</span>
                      <span className="text-muted-foreground">• {formatCurrency(service.cost)}</span>
                    </div>
                  </div>

                  {service.notes && (
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <strong>Observações:</strong> {service.notes}
                      </p>
                    </div>
                  )}
                </div>

                {service.attachment && (
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8">
                      <Download className="w-4 h-4 mr-2" />
                      Comprovante
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum serviço encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Tente ajustar os termos de busca.' 
                : 'Nenhum serviço de manutenção registrado ainda.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal de formulário */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do serviço de manutenção
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Veículo</Label>
                <Select 
                  value={formData.vehicleId} 
                  onValueChange={(value) => setFormData({...formData, vehicleId: value})}
                >
                  <SelectTrigger className={errors.vehicleId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.plate} - {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicleId && <p className="text-sm text-destructive">{errors.vehicleId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Tipo de Serviço</Label>
                <Input
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  placeholder="Ex: Troca de óleo"
                  className={errors.serviceType ? 'border-destructive' : ''}
                />
                {errors.serviceType && <p className="text-sm text-destructive">{errors.serviceType}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceDescription">Descrição do Serviço</Label>
              <Textarea
                id="serviceDescription"
                value={formData.serviceDescription}
                onChange={(e) => setFormData({...formData, serviceDescription: e.target.value})}
                placeholder="Descreva o serviço realizado"
                className={errors.serviceDescription ? 'border-destructive' : ''}
              />
              {errors.serviceDescription && <p className="text-sm text-destructive">{errors.serviceDescription}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Oficina Central"
                  className={errors.location ? 'border-destructive' : ''}
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={errors.date ? 'border-destructive' : ''}
                />
                {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Custo (R$)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  placeholder="0,00"
                  className={errors.cost ? 'border-destructive' : ''}
                />
                {errors.cost && <p className="text-sm text-destructive">{errors.cost}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician">Motorista</Label>
                <Input
                  id="technician"
                  value={formData.technician}
                  onChange={(e) => setFormData({...formData, technician: e.target.value})}
                  placeholder="Nome do motorista"
                  className={errors.technician ? 'border-destructive' : ''}
                />
                {errors.technician && <p className="text-sm text-destructive">{errors.technician}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment">Comprovante (opcional)</Label>
              <div className="flex items-center gap-3 p-4 border border-dashed rounded-md">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Arraste e solte o arquivo aqui</p>
                  <p className="text-xs text-muted-foreground">ou clique para selecionar</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('attachment')?.click()}
                >
                  Selecionar arquivo
                </Button>
                <Input
                  id="attachment"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Simula upload e gera URL temporária
                      const objectUrl = URL.createObjectURL(file);
                      setFormData({...formData, attachment: objectUrl});
                    }
                  }}
                />
              </div>
              {formData.attachment && (
                <p className="text-xs text-muted-foreground">
                  Arquivo selecionado: {formData.attachment}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observações adicionais"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingService ? 'Atualizar' : 'Criar'} Serviço
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}