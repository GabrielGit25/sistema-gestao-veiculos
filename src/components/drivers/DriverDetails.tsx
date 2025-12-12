import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Upload } from "lucide-react";
import { Driver, estadosBrasileiros, categoriasCNH } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ImageUploadModal } from "@/components/shared/ImageUploadModal";

interface DriverDetailsProps {
  driver: Driver;
  onBack: () => void;
  onUpdate: (driver: Driver) => void;
}

export function DriverDetails({ driver, onBack, onUpdate }: DriverDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDriver, setEditedDriver] = useState<Driver>(driver);
  const [showImageModal, setShowImageModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    setEditedDriver(driver);
  }, [driver]);

  const handleSave = () => {
    onUpdate(editedDriver);
    setIsEditing(false);
    setLastUpdated(new Date());
  };

  const handleCancel = () => {
    setEditedDriver(driver);
    setIsEditing(false);
  };

  const handleImageUpload = (imageUrl: string) => {
    const newDriver = { ...editedDriver, imageSrc: imageUrl };
    setEditedDriver(newDriver);
    onUpdate(newDriver);
    setShowImageModal(false);
  };

  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div>
      <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Driver Image */}
          <div 
            className="relative w-48 h-48 rounded-lg overflow-hidden bg-secondary shrink-0 cursor-pointer group"
            onClick={() => setShowImageModal(true)}
          >
            {editedDriver.imageSrc ? (
              <img 
                src={editedDriver.imageSrc} 
                alt={editedDriver.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-border">
                <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground text-center">Adicionar foto do motorista</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Driver Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{editedDriver.nome}</h1>
            <p className="text-sm text-muted-foreground">Motorista</p>
            <p className="text-xs text-muted-foreground mb-4">última atualização: {formatDate(lastUpdated)}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Categoria CNH</label>
                <p className="text-sm font-medium">{editedDriver.categoriaCNH}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Telefone</label>
                <p className="text-sm font-medium">{editedDriver.telefone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="mt-6">
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

          {/* Personal Info Section */}
          <h2 className="text-lg font-semibold mb-4">Informações pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium block mb-2">Nome completo *</label>
              {isEditing ? (
                <input
                  type="text"
                  className="detail-input"
                  value={editedDriver.nome}
                  onChange={(e) => setEditedDriver({ ...editedDriver, nome: e.target.value })}
                />
              ) : (
                <div className="detail-field">{editedDriver.nome}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">CPF *</label>
              {isEditing ? (
                <input
                  type="text"
                  className="detail-input"
                  value={editedDriver.cpf}
                  onChange={(e) => setEditedDriver({ ...editedDriver, cpf: e.target.value })}
                />
              ) : (
                <div className="detail-field">{editedDriver.cpf}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Data de nascimento *</label>
              {isEditing ? (
                <input
                  type="date"
                  className="detail-input"
                  value={editedDriver.dataNascimento}
                  onChange={(e) => setEditedDriver({ ...editedDriver, dataNascimento: e.target.value })}
                />
              ) : (
                <div className="detail-field">{formatDateForDisplay(editedDriver.dataNascimento)}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Telefone *</label>
              {isEditing ? (
                <input
                  type="text"
                  className="detail-input"
                  value={editedDriver.telefone}
                  onChange={(e) => setEditedDriver({ ...editedDriver, telefone: e.target.value })}
                />
              ) : (
                <div className="detail-field">{editedDriver.telefone}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  className="detail-input"
                  value={editedDriver.email}
                  onChange={(e) => setEditedDriver({ ...editedDriver, email: e.target.value })}
                />
              ) : (
                <div className="detail-field">{editedDriver.email}</div>
              )}
            </div>
          </div>

          {/* CNH Section */}
          <h2 className="text-lg font-semibold mb-4">Informações da CNH</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium block mb-2">Número da CNH *</label>
              {isEditing ? (
                <input
                  type="text"
                  className="detail-input"
                  value={editedDriver.cnh}
                  onChange={(e) => setEditedDriver({ ...editedDriver, cnh: e.target.value })}
                />
              ) : (
                <div className="detail-field">{editedDriver.cnh}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Categoria *</label>
              {isEditing ? (
                <select
                  className="detail-input"
                  value={editedDriver.categoriaCNH}
                  onChange={(e) => setEditedDriver({ ...editedDriver, categoriaCNH: e.target.value })}
                >
                  {categoriasCNH.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              ) : (
                <div className="detail-field">{editedDriver.categoriaCNH}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Validade *</label>
              {isEditing ? (
                <input
                  type="date"
                  className="detail-input"
                  value={editedDriver.validadeCNH}
                  onChange={(e) => setEditedDriver({ ...editedDriver, validadeCNH: e.target.value })}
                />
              ) : (
                <div className="detail-field">{formatDateForDisplay(editedDriver.validadeCNH)}</div>
              )}
            </div>
          </div>

          {/* Address Section */}
          <h2 className="text-lg font-semibold mb-4">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Endereço</label>
              {isEditing ? (
                <input
                  type="text"
                  className="detail-input"
                  value={editedDriver.endereco}
                  onChange={(e) => setEditedDriver({ ...editedDriver, endereco: e.target.value })}
                />
              ) : (
                <div className="detail-field">{editedDriver.endereco}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Bairro</label>
              {isEditing ? (
                <input
                  type="text"
                  className="detail-input"
                  value={editedDriver.bairro}
                  onChange={(e) => setEditedDriver({ ...editedDriver, bairro: e.target.value })}
                />
              ) : (
                <div className="detail-field">{editedDriver.bairro}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Cidade</label>
              {isEditing ? (
                <input
                  type="text"
                  className="detail-input"
                  value={editedDriver.cidade}
                  onChange={(e) => setEditedDriver({ ...editedDriver, cidade: e.target.value })}
                />
              ) : (
                <div className="detail-field">{editedDriver.cidade}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Estado</label>
              {isEditing ? (
                <select
                  className="detail-input"
                  value={editedDriver.estado}
                  onChange={(e) => setEditedDriver({ ...editedDriver, estado: e.target.value })}
                >
                  {estadosBrasileiros.map((estado) => (
                    <option key={estado.value} value={estado.value}>{estado.label}</option>
                  ))}
                </select>
              ) : (
                <div className="detail-field">{estadosBrasileiros.find(e => e.value === editedDriver.estado)?.label}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">CEP</label>
              {isEditing ? (
                <input
                  type="text"
                  className="detail-input"
                  value={editedDriver.cep}
                  onChange={(e) => setEditedDriver({ ...editedDriver, cep: e.target.value })}
                />
              ) : (
                <div className="detail-field">{editedDriver.cep}</div>
              )}
            </div>
          </div>
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
