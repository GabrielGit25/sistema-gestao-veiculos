import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Upload, Users } from "lucide-react";
import { Vehicle, Driver, marcasVeiculos, tiposVeiculo, tiposCarroceria, estadosBrasileiros, initialDrivers } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageUploadModal } from "@/components/shared/ImageUploadModal";
import { ImageGalleryModal } from "@/components/shared/ImageGalleryModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onBack: () => void;
  onUpdate: (vehicle: Vehicle) => void;
}

const tabs = [
  { id: 'info', label: 'Detalhes do veículo' },
  { id: 'fotos', label: 'Fotos' },
  { id: 'despesas', label: 'Despesas' },
  { id: 'manutencao', label: 'Manutenção' },
  { id: 'alarmes', label: 'Alarmes' },
  { id: 'gps', label: 'GPS' },
  { id: 'verificacoes', label: 'Verificações' },
];

export function VehicleDetails({ vehicle, onBack, onUpdate }: VehicleDetailsProps) {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<Vehicle>(vehicle);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [currentFotoArea, setCurrentFotoArea] = useState<string>('');
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Motoristas disponíveis para atribuição
  const availableDrivers: Driver[] = initialDrivers;
  
  const handleDriverChange = (driverName: string) => {
    const newVehicle = { ...editedVehicle, motorista: driverName };
    setEditedVehicle(newVehicle);
    onUpdate(newVehicle);
    setLastUpdated(new Date());
  };

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
    onUpdate(editedVehicle);
    setIsEditing(false);
    setLastUpdated(new Date());
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

  const handleFotoUpload = (imageUrl: string) => {
    if (currentFotoArea && editedVehicle.fotos) {
      const newFotos = { ...editedVehicle.fotos, [currentFotoArea]: imageUrl };
      const newVehicle = { ...editedVehicle, fotos: newFotos };
      setEditedVehicle(newVehicle);
      onUpdate(newVehicle);
      setShowImageModal(false);
      setCurrentFotoArea('');
    }
  };

  const openFotoUploadModal = (area: string) => {
    setCurrentFotoArea(area);
    setShowImageModal(true);
  };

  const openGalleryModal = (initialIndex: number) => {
    setGalleryInitialIndex(initialIndex);
    setShowGalleryModal(true);
  };

  const getGalleryImages = () => {
    if (!editedVehicle.fotos) return [];
    
    const fotoAreas = [
      'dianteira', 'lateralDireita', 'lateralEsquerda', 
      'traseira', 'painelInstrumentos', 'cambio',
      'painel', 'pneuDianteiroDireito', 'pneuDianteiroEsquerdo',
      'pneuTraseiroDireito', 'pneuTraseiroEsquerdo'
    ];
    
    const titles = {
      dianteira: 'Foto dianteira',
      lateralDireita: 'Foto lateral direita', 
      lateralEsquerda: 'Foto lateral esquerda',
      traseira: 'Foto traseira',
      painelInstrumentos: 'Foto painel de instrumentos',
      cambio: 'Foto do câmbio',
      painel: 'Foto do painel',
      pneuDianteiroDireito: 'Foto pneu dianteiro direito',
      pneuDianteiroEsquerdo: 'Foto pneu dianteiro esquerdo',
      pneuTraseiroDireito: 'Foto pneu traseiro direito',
      pneuTraseiroEsquerdo: 'Foto pneu traseiro esquerdo'
    };
    
    return fotoAreas
      .filter(area => editedVehicle.fotos?.[area])
      .map(area => ({
        url: editedVehicle.fotos[area],
        title: titles[area as keyof typeof titles]
      }));
  };

  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Motorista</label>
                {isAdmin ? (
                  <Select value={editedVehicle.motorista} onValueChange={handleDriverChange}>
                    <SelectTrigger className="w-full h-8 text-sm">
                      <SelectValue placeholder="Selecionar motorista" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">Sem motorista</SelectItem>
                      {availableDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.nome}>
                          {driver.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium">{editedVehicle.motorista}</p>
                )}
              </div>
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
                      value={editedVehicle.placa}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, placa: e.target.value.toUpperCase() })}
                      maxLength={7}
                    />
                  ) : (
                    <div className="detail-field">{editedVehicle.placa}</div>
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
                    <div className="detail-field">{new Date(editedVehicle.dataAquisicao).toLocaleDateString('pt-BR')}</div>
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

          {activeTab === 'fotos' && (
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-6">Fotos do Veículo</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Foto dianteira */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto dianteira</h3>
                  {editedVehicle.fotos?.dianteira ? (
                    <div 
                      className="w-full h-32 rounded mb-2 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const images = getGalleryImages();
                        const index = images.findIndex(img => img.title === 'Foto dianteira');
                        if (index !== -1) openGalleryModal(index);
                      }}
                    >
                      <img 
                        src={editedVehicle.fotos.dianteira} 
                        alt="Foto dianteira" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('dianteira')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.dianteira ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>

                {/* Foto lateral direita */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto lateral direita</h3>
                  {editedVehicle.fotos?.lateralDireita ? (
                    <div 
                      className="w-full h-32 rounded mb-2 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const images = getGalleryImages();
                        const index = images.findIndex(img => img.title === 'Foto lateral direita');
                        if (index !== -1) openGalleryModal(index);
                      }}
                    >
                      <img 
                        src={editedVehicle.fotos.lateralDireita} 
                        alt="Foto lateral direita" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('lateralDireita')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.lateralDireita ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>

                {/* Foto lateral esquerda */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto lateral esquerda</h3>
                  {editedVehicle.fotos?.lateralEsquerda ? (
                    <div 
                      className="w-full h-32 rounded mb-2 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const images = getGalleryImages();
                        const index = images.findIndex(img => img.title === 'Foto lateral esquerda');
                        if (index !== -1) openGalleryModal(index);
                      }}
                    >
                      <img 
                        src={editedVehicle.fotos.lateralEsquerda} 
                        alt="Foto lateral esquerda" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('lateralEsquerda')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.lateralEsquerda ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>

                {/* Foto traseira */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto traseira</h3>
                  {editedVehicle.fotos?.traseira ? (
                    <div 
                      className="w-full h-32 rounded mb-2 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const images = getGalleryImages();
                        const index = images.findIndex(img => img.title === 'Foto traseira');
                        if (index !== -1) openGalleryModal(index);
                      }}
                    >
                      <img 
                        src={editedVehicle.fotos.traseira} 
                        alt="Foto traseira" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('traseira')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.traseira ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>

                {/* Foto painel de instrumentos */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto painel de instrumentos</h3>
                  {editedVehicle.fotos?.painelInstrumentos ? (
                    <div 
                      className="w-full h-32 rounded mb-2 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const images = getGalleryImages();
                        const index = images.findIndex(img => img.title === 'Foto painel de instrumentos');
                        if (index !== -1) openGalleryModal(index);
                      }}
                    >
                      <img 
                        src={editedVehicle.fotos.painelInstrumentos} 
                        alt="Foto painel de instrumentos" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('painelInstrumentos')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.painelInstrumentos ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>

                {/* Foto do câmbio */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto do câmbio</h3>
                  {editedVehicle.fotos?.cambio ? (
                    <div 
                      className="w-full h-32 rounded mb-2 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const images = getGalleryImages();
                        const index = images.findIndex(img => img.title === 'Foto do câmbio');
                        if (index !== -1) openGalleryModal(index);
                      }}
                    >
                      <img 
                        src={editedVehicle.fotos.cambio} 
                        alt="Foto do câmbio" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('cambio')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.cambio ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>

                {/* Foto do painel */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto do painel</h3>
                  {editedVehicle.fotos?.painel ? (
                    <div 
                      className="w-full h-32 rounded mb-2 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const images = getGalleryImages();
                        const index = images.findIndex(img => img.title === 'Foto do painel');
                        if (index !== -1) openGalleryModal(index);
                      }}
                    >
                      <img 
                        src={editedVehicle.fotos.painel} 
                        alt="Foto do painel" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('painel')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.painel ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>

                {/* Foto do motor */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto do motor</h3>
                  {editedVehicle.fotos?.motor ? (
                    <img 
                      src={editedVehicle.fotos.motor} 
                      alt="Foto do motor" 
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('motor')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.motor ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>

                {/* Foto pneu dianteiro direito */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto pneu dianteiro direito</h3>
                  {editedVehicle.fotos?.pneuDianteiroDireito ? (
                    <div 
                      className="w-full h-32 rounded mb-2 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const images = getGalleryImages();
                        const index = images.findIndex(img => img.title === 'Foto pneu dianteiro direito');
                        if (index !== -1) openGalleryModal(index);
                      }}
                    >
                      <img 
                        src={editedVehicle.fotos.pneuDianteiroDireito} 
                        alt="Foto pneu dianteiro direito" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('pneuDianteiroDireito')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.pneuDianteiroDireito ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>

                {/* Foto pneu dianteiro esquerdo */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto pneu dianteiro esquerdo</h3>
                  {editedVehicle.fotos?.pneuDianteiroEsquerdo ? (
                    <div 
                      className="w-full h-32 rounded mb-2 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const images = getGalleryImages();
                        const index = images.findIndex(img => img.title === 'Foto pneu dianteiro esquerdo');
                        if (index !== -1) openGalleryModal(index);
                      }}
                    >
                      <img 
                        src={editedVehicle.fotos.pneuDianteiroEsquerdo} 
                        alt="Foto pneu dianteiro esquerdo" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('pneuDianteiroEsquerdo')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.pneuDianteiroEsquerdo ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>

                {/* Foto pneu traseiro direito */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto pneu traseiro direito</h3>
                  {editedVehicle.fotos?.pneuTraseiroDireito ? (
                    <div 
                      className="w-full h-32 rounded mb-2 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const images = getGalleryImages();
                        const index = images.findIndex(img => img.title === 'Foto pneu traseiro direito');
                        if (index !== -1) openGalleryModal(index);
                      }}
                    >
                      <img 
                        src={editedVehicle.fotos.pneuTraseiroDireito} 
                        alt="Foto pneu traseiro direito" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('pneuTraseiroDireito')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.pneuTraseiroDireito ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>

                {/* Foto pneu traseiro esquerdo */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-medium mb-2">Foto pneu traseiro esquerdo</h3>
                  {editedVehicle.fotos?.pneuTraseiroEsquerdo ? (
                    <div 
                      className="w-full h-32 rounded mb-2 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const images = getGalleryImages();
                        const index = images.findIndex(img => img.title === 'Foto pneu traseiro esquerdo');
                        if (index !== -1) openGalleryModal(index);
                      }}
                    >
                      <img 
                        src={editedVehicle.fotos.pneuTraseiroEsquerdo} 
                        alt="Foto pneu traseiro esquerdo" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openFotoUploadModal('pneuTraseiroEsquerdo')}
                    className="w-full"
                  >
                    {editedVehicle.fotos?.pneuTraseiroEsquerdo ? 'Alterar' : 'Adicionar'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'info' && activeTab !== 'fotos' && (
            <div className="bg-card rounded-lg p-6">
              <p className="text-muted-foreground">{tabs.find(t => t.id === activeTab)?.label} content...</p>
            </div>
          )}
        </div>
      </div>

      <ImageUploadModal 
        isOpen={showImageModal}
        onClose={() => {
          setShowImageModal(false);
          setCurrentFotoArea('');
        }}
        onUpload={currentFotoArea ? handleFotoUpload : handleImageUpload}
      />

      <ImageGalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        images={getGalleryImages()}
        initialIndex={galleryInitialIndex}
      />
    </div>
  );
}
