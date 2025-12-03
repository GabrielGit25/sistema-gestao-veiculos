import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Upload } from "lucide-react";
import { Vehicle, marcasVeiculos, tiposVeiculo, tiposCarroceria, estadosBrasileiros } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageUploadModal } from "@/components/shared/ImageUploadModal";

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onBack: () => void;
  onUpdate: (vehicle: Vehicle) => void;
}

const tabs = [
  { id: 'info', label: 'Detalhes do veículo' },
  { id: 'controlo', label: 'Controlo' },
  { id: 'despesas', label: 'Despesas' },
  { id: 'manutencao', label: 'Manutenção' },
  { id: 'alarmes', label: 'Alarmes' },
  { id: 'gps', label: 'GPS' },
  { id: 'verificacoes', label: 'Verificações' },
];

export function VehicleDetails({ vehicle, onBack, onUpdate }: VehicleDetailsProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<Vehicle>(vehicle);
  const [showImageModal, setShowImageModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    setEditedVehicle(vehicle);
  }, [vehicle]);

  const handleStatusClick = () => {
    const statuses: Vehicle['status'][] = ['Em serviço', 'Em manutenção', 'Fora de serviço'];
    const currentIndex = statuses.indexOf(editedVehicle.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const newVehicle = { ...editedVehicle, status: statuses[nextIndex] };
    setEditedVehicle(newVehicle);
    onUpdate(newVehicle);
    setLastUpdated(new Date());
  };

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

  const handleSave = () => {
    if (!validateRequiredFields()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    onUpdate(editedVehicle);
    setIsEditing(false);
    setLastUpdated(new Date());
    alert('Informações salvas com sucesso!');
  };

  const handleCancel = () => {
    setEditedVehicle(vehicle);
    setIsEditing(false);
  };

  const handleImageUpload = (imageUrl: string) => {
    const newVehicle = { ...editedVehicle, imageSrc: imageUrl };
    setEditedVehicle(newVehicle);
    onUpdate(newVehicle);
    setShowImageModal(false);
  };

  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    // Converte de YYYY-MM-DD para DD/MM/YYYY
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Funções de máscara e validação
  const applyPlateMask = (value: string) => {
    const lettersAndNumbers = value.replace(/[^a-zA-Z0-9]/g, '');
    if (lettersAndNumbers.length <= 7) {
      return lettersAndNumbers
        .replace(/([A-Za-z]{3})(\d)/, '$1$2')
        .replace(/([A-Za-z]{3}\d{1})(\d)/, '$1$2')
        .replace(/([A-Za-z]{3}\d{2})(\d)/, '$1$2')
        .replace(/([A-Za-z]{3}\d{3})(\d)/, '$1$2');
    }
    return lettersAndNumbers.slice(0, 7).toUpperCase();
  };

  // Função de validação de campos obrigatórios
  const validateRequiredFields = () => {
    const requiredFields: (keyof Vehicle)[] = [
      'placa', 'modelo', 'marca', 'estado', 'status', 'quilometragem', 
      'combustivel', 'ano', 'tipoVeiculo', 'tipoCarroceria', 'capacidade', 
      'condicao', 'dataAquisicao', 'cor', 'potencia', 'estadoUF'
    ];
    
    return requiredFields.every(field => {
      const value = editedVehicle[field];
      return value !== undefined && value !== null && value.toString().trim() !== '';
    });
  };

  return (
    <div>
      <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Vehicle Image */}
          <div 
            className="relative w-48 h-32 rounded-lg overflow-hidden bg-secondary shrink-0 cursor-pointer group"
            onClick={() => setShowImageModal(true)}
          >
            {editedVehicle.imageSrc ? (
              <img 
                src={editedVehicle.imageSrc} 
                alt={`${editedVehicle.marca} ${editedVehicle.modelo}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-border">
                <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground text-center">Adicionar foto do veículo</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{editedVehicle.placa}</h1>
            <p className="text-lg text-muted-foreground">{editedVehicle.marca} {editedVehicle.modelo}</p>
            <p className="text-sm text-muted-foreground">Veículo do Estado {editedVehicle.estado}</p>
            <p className="text-xs text-muted-foreground mb-4">última atualização: {formatDate(lastUpdated)}</p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Status</label>
                <span 
                  className={cn("status-badge", getStatusClass(editedVehicle.status))}
                  onClick={handleStatusClick}
                >
                  {editedVehicle.status}
                </span>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Quilometragem</label>
                <p className="text-sm font-medium">{parseInt(editedVehicle.quilometragem.replace(/\D/g, '')).toLocaleString('pt-BR')} km</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Combustível</label>
                <p className="text-sm font-medium">{editedVehicle.combustivel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="flex gap-1 border-b border-border overflow-x-auto mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 border-transparent whitespace-nowrap transition-colors text-muted-foreground hover:text-foreground",
                  activeTab === tab.id && "text-primary border-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'info' && (
            <div>
              <div className="flex gap-2 mb-4">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <>
                    <Button variant="default" className="bg-success hover:bg-success/90" onClick={handleSave}>
                      Salvar
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </>
                )}
              </div>

              <h2 className="text-lg font-semibold mb-4">Informação sobre o veículo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">PLACA *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="detail-input"
                      value={applyPlateMask(editedVehicle.placa)}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, placa: e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() })}
                      maxLength={7}
                      placeholder="AAA0000"
                    />
                  ) : (
                    <div className="detail-field">{applyPlateMask(editedVehicle.placa)}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Marca *</label>
                  {isEditing ? (
                    <select
                      className="detail-input"
                      value={editedVehicle.marca}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, marca: e.target.value })}
                    >
                      {marcasVeiculos.map((marca) => (
                        <option key={marca} value={marca}>{marca}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="detail-field">{editedVehicle.marca}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Modelo *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="detail-input"
                      value={editedVehicle.modelo}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, modelo: e.target.value })}
                    />
                  ) : (
                    <div className="detail-field">{editedVehicle.modelo}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Ano *</label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="detail-input"
                      value={editedVehicle.ano}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, ano: parseInt(e.target.value) })}
                      min={1900}
                      max={2030}
                    />
                  ) : (
                    <div className="detail-field">{editedVehicle.ano}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Tipo de veículo *</label>
                  {isEditing ? (
                    <select
                      className="detail-input"
                      value={editedVehicle.tipoVeiculo}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, tipoVeiculo: e.target.value })}
                    >
                      {tiposVeiculo.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="detail-field">{tiposVeiculo.find(t => t.value === editedVehicle.tipoVeiculo)?.label}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Tipo de carroceria *</label>
                  {isEditing ? (
                    <select
                      className="detail-input"
                      value={editedVehicle.tipoCarroceria}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, tipoCarroceria: e.target.value })}
                    >
                      {tiposCarroceria.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="detail-field">{tiposCarroceria.find(t => t.value === editedVehicle.tipoCarroceria)?.label}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Capacidade de carga/passageiros *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="detail-input"
                      value={editedVehicle.capacidade}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, capacidade: e.target.value })}
                    />
                  ) : (
                    <div className="detail-field">{editedVehicle.capacidade}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Condição *</label>
                  {isEditing ? (
                    <select
                      className="detail-input"
                      value={editedVehicle.condicao}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, condicao: e.target.value })}
                    >
                      <option value="proprio">Próprio</option>
                      <option value="alugado">Alugado</option>
                    </select>
                  ) : (
                    <div className="detail-field">{editedVehicle.condicao === 'proprio' ? 'Próprio' : 'Alugado'}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Data de aquisição *</label>
                  {isEditing ? (
                    <input
                      type="date"
                      className="detail-input"
                      value={editedVehicle.dataAquisicao}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, dataAquisicao: e.target.value })}
                    />
                  ) : (
                    <div className="detail-field">{formatDateForDisplay(editedVehicle.dataAquisicao)}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Cor</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="detail-input"
                      value={editedVehicle.cor}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, cor: e.target.value })}
                    />
                  ) : (
                    <div className="detail-field">{editedVehicle.cor}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">CV/Potência</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="detail-input"
                      value={editedVehicle.potencia}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, potencia: e.target.value })}
                    />
                  ) : (
                    <div className="detail-field">{editedVehicle.potencia}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Estado</label>
                  {isEditing ? (
                    <select
                      className="detail-input"
                      value={editedVehicle.estadoUF}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, estadoUF: e.target.value })}
                    >
                      <option value="">Selecione...</option>
                      {estadosBrasileiros.map((estado) => (
                        <option key={estado.value} value={estado.value}>{estado.label}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="detail-field">{estadosBrasileiros.find(e => e.value === editedVehicle.estadoUF)?.label || editedVehicle.estado}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Quilometragem atual</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="detail-input"
                      value={editedVehicle.quilometragem}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, quilometragem: e.target.value })}
                    />
                  ) : (
                    <div className="detail-field">{editedVehicle.quilometragem} km</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Combustível *</label>
                  {isEditing ? (
                    <select
                      className="detail-input"
                      value={editedVehicle.combustivel.toLowerCase()}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, combustivel: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) })}
                    >
                      <option value="gasolina">Gasolina</option>
                      <option value="etanol">Etanol</option>
                      <option value="diesel">Diesel</option>
                    </select>
                  ) : (
                    <div className="detail-field">{editedVehicle.combustivel}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'info' && (
            <div className="bg-card rounded-lg p-6">
              <p className="text-muted-foreground">{tabs.find(t => t.id === activeTab)?.label} content...</p>
            </div>
          )}
        </div>
      </div>

      <ImageUploadModal 
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onUpload={handleImageUpload}
      />
    </div>
  );
}
