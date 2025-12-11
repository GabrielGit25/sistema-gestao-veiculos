import { useState, useEffect } from "react";
import { Plus, Filter, Calendar, Car, AlertTriangle, CheckCircle, Clock, FileText, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vehicle, VehicleAlert, initialAlerts, initialVehicles } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface AlertsProps {
  alerts: VehicleAlert[];
  onUpdateAlerts: (alerts: VehicleAlert[]) => void;
}

export function Alerts({ alerts, onUpdateAlerts }: AlertsProps) {
  const { isAdmin } = useAuth();
  const [filteredAlerts, setFilteredAlerts] = useState<VehicleAlert[]>(alerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [showNewAlertForm, setShowNewAlertForm] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<VehicleAlert>>({
    tipo: 'troca_oleo',
    status: 'pendente'
  });
  const [customServiceDescription, setCustomServiceDescription] = useState('');

  useEffect(() => {
    let result = alerts;

    if (searchTerm) {
      result = result.filter(alert => 
        alert.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        initialVehicles.find(v => v.id === alert.vehicleId)?.placa.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'expirado') {
        result = result.filter(alert => 
          alert.status === 'pendente' && getDaysUntilExpiration(alert.dataExpiracao) < 0
        );
      } else {
        result = result.filter(alert => alert.status === statusFilter);
      }
    }



    if (vehicleFilter !== 'all') {
      result = result.filter(alert => alert.vehicleId === parseInt(vehicleFilter));
    }

    setFilteredAlerts(result);
  }, [alerts, searchTerm, statusFilter, vehicleFilter]);

  const handleAddAlert = () => {
    if (!newAlert.descricao || !newAlert.vehicleId || !newAlert.dataExpiracao) {
      return;
    }

    const alert: VehicleAlert = {
      id: Math.max(...alerts.map(a => a.id), 0) + 1,
      vehicleId: newAlert.vehicleId!,
      tipo: newAlert.tipo!,
      descricao: newAlert.tipo === 'outro' ? customServiceDescription : newAlert.descricao!,
      dataCriacao: new Date().toISOString().split('T')[0],
      dataExpiracao: newAlert.dataExpiracao!,
      dataConclusao: null,
      status: 'pendente'
    };

    onUpdateAlerts([...alerts, alert]);
    setNewAlert({
      tipo: 'troca_oleo',
      status: 'pendente'
    });
    setCustomServiceDescription('');
    setShowNewAlertForm(false);
  };

  const handleCompleteAlert = (alertId: number) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'concluido', dataConclusao: new Date().toISOString().split('T')[0] }
        : alert
    );
    onUpdateAlerts(updatedAlerts);
  };

  const handleDeleteAlert = (alertId: number) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    onUpdateAlerts(updatedAlerts);
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'troca_oleo': return <Filter className="w-4 h-4" />;
      case 'bateria': return <AlertTriangle className="w-4 h-4" />;
      case 'pneu': return <Car className="w-4 h-4" />;
      case 'revisao': return <Wrench className="w-4 h-4" />;
      case 'documento': return <FileText className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente': return <Badge variant="secondary">Pendente</Badge>;
      case 'concluido': return <Badge variant="success">Concluído</Badge>;
      case 'expirado': return <Badge variant="destructive">Expirado</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return <Badge variant="destructive">Alta</Badge>;
      case 'media': return <Badge variant="warning">Média</Badge>;
      case 'baixa': return <Badge variant="outline">Baixa</Badge>;
      default: return <Badge>{prioridade}</Badge>;
    }
  };

  const getVehicleInfo = (vehicleId: number) => {
    const vehicle = initialVehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.placa} - ${vehicle.marca} ${vehicle.modelo}` : 'Veículo não encontrado';
  };

  const getDaysUntilExpiration = (dataExpiracao: string) => {
    const today = new Date();
    const expirationDate = new Date(dataExpiracao);
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpirationStatus = (alert: VehicleAlert) => {
    if (alert.status === 'concluido') return 'concluido';
    
    const daysUntilExpiration = getDaysUntilExpiration(alert.dataExpiracao);
    
    if (daysUntilExpiration < 0) return 'expirado';
    if (daysUntilExpiration <= 3) return 'critico';
    if (daysUntilExpiration <= 7) return 'alerta';
    return 'normal';
  };

  const expiredAlertsCount = alerts.filter(alert => 
    alert.status !== 'concluido' && getDaysUntilExpiration(alert.dataExpiracao) < 0
  ).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Alertas</h1>
          <p className="text-muted-foreground">
            Gerencie os lembretes de manutenção dos veículos
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowNewAlertForm(!showNewAlertForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Alerta
          </Button>
        )}
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar por descrição ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="expirado">Expirado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Veículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os veículos</SelectItem>
                {initialVehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.placa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de novo alerta */}
      {showNewAlertForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Novo Alerta</CardTitle>
            <CardDescription>Adicione um novo lembrete de manutenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select 
                value={newAlert.vehicleId?.toString()} 
                onValueChange={(value) => setNewAlert({...newAlert, vehicleId: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Veículo" />
                </SelectTrigger>
                <SelectContent>
                  {initialVehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.placa} - {vehicle.marca} {vehicle.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={newAlert.tipo} 
                onValueChange={(value) => setNewAlert({...newAlert, tipo: value as 'troca_oleo' | 'bateria' | 'pneu' | 'revisao' | 'documento' | 'outro'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="troca_oleo">Troca de Óleo</SelectItem>
                  <SelectItem value="bateria">Bateria</SelectItem>
                  <SelectItem value="pneu">Pneu</SelectItem>
                  <SelectItem value="revisao">Revisão</SelectItem>
                  <SelectItem value="documento">Documento</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>

              {newAlert.tipo === 'outro' && (
                <Input
                  placeholder="Descrição do serviço personalizado"
                  value={customServiceDescription}
                  onChange={(e) => setCustomServiceDescription(e.target.value)}
                />
              )}

              {newAlert.tipo !== 'outro' && (
                <Input
                  placeholder="Descrição"
                  value={newAlert.descricao || ''}
                  onChange={(e) => setNewAlert({...newAlert, descricao: e.target.value})}
                />
              )}
              <Input
                type="date"
                placeholder="Data de expiração"
                value={newAlert.dataExpiracao || ''}
                onChange={(e) => setNewAlert({...newAlert, dataExpiracao: e.target.value})}
              />

            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddAlert}>Adicionar</Button>
              <Button variant="outline" onClick={() => setShowNewAlertForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de alertas */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAlerts.map((alert) => {
          const expirationStatus = getExpirationStatus(alert);
          const daysUntilExpiration = getDaysUntilExpiration(alert.dataExpiracao);
          
          return (
            <Card key={alert.id} className={cn(
              "border-l-4",
              expirationStatus === 'expirado' && "border-l-destructive",
              expirationStatus === 'critico' && "border-l-amber-500",
              expirationStatus === 'alerta' && "border-l-amber-300",
              expirationStatus === 'normal' && "border-l-blue-500",
              alert.status === 'concluido' && "border-l-green-500"
            )}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.tipo)}
                    <CardTitle className="text-lg">{alert.descricao}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(alert.status)}
                    {getPriorityBadge(alert.prioridade)}
                  </div>
                </div>
                <CardDescription>
                  {getVehicleInfo(alert.vehicleId)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Criação:</span>
                    <p>{new Date(alert.dataCriacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="font-medium">Expiração:</span>
                    <p className={cn(
                      expirationStatus === 'expirado' && "text-destructive",
                      expirationStatus === 'critico' && "text-amber-600",
                      expirationStatus === 'alerta' && "text-amber-500"
                    )}>
                      {new Date(alert.dataExpiracao).toLocaleDateString('pt-BR')}
                      {alert.status !== 'concluido' && (
                        <span className="ml-2 text-xs">
                          ({daysUntilExpiration > 0 ? `${daysUntilExpiration} dias` : 'Expirado'})
                        </span>
                      )}
                    </p>
                  </div>
                  {alert.dataConclusao && (
                    <div>
                      <span className="font-medium">Conclusão:</span>
                      <p>{new Date(alert.dataConclusao).toLocaleDateString('pt-BR')}</p>
                    </div>
                  )}
                </div>
                
                {alert.observacoes && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <span className="font-medium">Observações:</span>
                    <p className="text-sm">{alert.observacoes}</p>
                  </div>
                )}

                {isAdmin && alert.status !== 'concluido' && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      onClick={() => handleCompleteAlert(alert.id)}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Concluir
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum alerta encontrado</h3>
            <p className="text-muted-foreground text-center">
              {alerts.length === 0 
                ? "Você ainda não tem alertas cadastrados." 
                : "Tente ajustar os filtros para encontrar o que procura."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}