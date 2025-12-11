import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X, Edit, Trash, Plus, MapPin, Upload, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ItineraryUploadModal } from "@/components/shared/ItineraryUploadModal";
import { Vehicle } from "@/data/mockData";

export interface ItineraryPhoto {
  id: number;
  vehicleId: number;
  driverId: number;
  photoUrl: string;
  timestamp: string;
  startTimestamp?: string;
  endTimestamp?: string;
  odometer?: string;
  notes?: string;
  driverName?: string;
  itineraryId?: number;
  position?: 'start' | 'end';
}

// Dados mockados para fotos do itinerário
export const mockItineraryPhotos: ItineraryPhoto[] = [
  {
    id: 1,
    vehicleId: 1,
    driverId: 1,
    photoUrl: "https://picsum.photos/seed/painel1/400/300",
    timestamp: "2024-01-15T08:30:00",
    odometer: "102.345 km",
    notes: "Início do turno"
  },
  {
    id: 2,
    vehicleId: 1,
    driverId: 1,
    photoUrl: "https://picsum.photos/seed/painel2/400/300",
    timestamp: "2024-01-15T12:45:00",
    odometer: "102.678 km",
    notes: "Almoço"
  },
  {
    id: 3,
    vehicleId: 1,
    driverId: 1,
    photoUrl: "https://picsum.photos/seed/painel3/400/300",
    timestamp: "2024-01-15T17:15:00",
    odometer: "103.012 km",
    notes: "Fim do turno"
  }
];

interface ItineraryProps {
  vehicles: Vehicle[];
}

export function Itinerary({ vehicles }: ItineraryProps) {
  const { user, isDriver } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itineraryPhotos, setItineraryPhotos] = useState<ItineraryPhoto[]>(mockItineraryPhotos);
  const [editMode, setEditMode] = useState<"replace" | "addReturn" | null>(null);
  const [targetPhotoId, setTargetPhotoId] = useState<number | null>(null);
  const [targetItineraryId, setTargetItineraryId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editAddress, setEditAddress] = useState("");
  const [editTarget, setEditTarget] = useState<ItineraryPhoto | null>(null);

  // Filtrar fotos baseado no tipo de usuário
  const baseFilteredPhotos = isDriver && user?.vehicleId
    ? itineraryPhotos.filter(photo => photo.vehicleId === user.vehicleId)
    : itineraryPhotos;

  // Filtrar fotos pela pesquisa (apenas para admin)
  const filteredPhotos = useMemo(() => {
    if (!searchTerm || isDriver) return baseFilteredPhotos;
    
    return baseFilteredPhotos.filter(photo => 
      photo.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(photo.timestamp).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [baseFilteredPhotos, searchTerm, isDriver]);

  const groupedPhotos = useMemo(() => {
    const groups: ItineraryPhoto[][] = [];
    const byItinerary = new Map<number, ItineraryPhoto[]>();

    filteredPhotos.forEach(photo => {
      if (photo.itineraryId) {
        const grp = byItinerary.get(photo.itineraryId) || [];
        grp.push(photo);
        byItinerary.set(photo.itineraryId, grp);
      }
    });

    if (byItinerary.size > 0) {
      const entries = Array.from(byItinerary.values()).map(g => {
        return g.sort((a, b) => {
          const ap = a.position === 'start' ? -1 : 1;
          const bp = b.position === 'start' ? -1 : 1;
          if (ap !== bp) return ap - bp;
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });
      });

      entries.sort((ga, gb) => {
        const ta = Math.max(...ga.map(p => new Date(p.timestamp).getTime()));
        const tb = Math.max(...gb.map(p => new Date(p.timestamp).getTime()));
        return tb - ta;
      });
      return entries;
    }

    const fallbackGroups: ItineraryPhoto[][] = [];
    const processedIds = new Set<number>();
    filteredPhotos.forEach(photo => {
      if (processedIds.has(photo.id)) return;
      const correspondingPhoto = filteredPhotos.find(p => 
        p.id !== photo.id &&
        p.driverName === photo.driverName &&
        !processedIds.has(p.id) &&
        Math.abs(new Date(p.timestamp).getTime() - new Date(photo.timestamp).getTime()) < 60000
      );
      if (correspondingPhoto) {
        fallbackGroups.push([photo, correspondingPhoto]);
        processedIds.add(photo.id);
        processedIds.add(correspondingPhoto.id);
      } else {
        fallbackGroups.push([photo]);
        processedIds.add(photo.id);
      }
    });
    return fallbackGroups;
  }, [filteredPhotos]);

  const handleItineraryUpload = (data: {
    startPhoto: string;
    endPhoto: string;
    endAddress: string;
    startTimestamp?: string;
    endTimestamp?: string;
  }) => {
    const itineraryId = Date.now();
    const newStartPhoto: ItineraryPhoto = {
      id: Math.max(...itineraryPhotos.map(p => p.id)) + 1,
      vehicleId: user?.vehicleId || 0,
      driverId: user?.driverId || 0,
      photoUrl: data.startPhoto,
      timestamp: data.startTimestamp || new Date().toISOString(),
      startTimestamp: data.startTimestamp,
      notes: `Partida`,
      driverName: user?.username,
      itineraryId,
      position: 'start'
    };

    const newEndPhoto: ItineraryPhoto = {
      id: Math.max(...itineraryPhotos.map(p => p.id)) + 2,
      vehicleId: user?.vehicleId || 0,
      driverId: user?.driverId || 0,
      photoUrl: data.endPhoto,
      timestamp: data.endTimestamp || new Date().toISOString(),
      endTimestamp: data.endTimestamp,
      notes: `Destino da Viagem: ${data.endAddress}`,
      driverName: user?.username,
      itineraryId,
      position: 'end'
    };
    
    setItineraryPhotos(prev => [newStartPhoto, newEndPhoto, ...prev]);
    setShowUploadModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTimeDifference = (start: string, end: string): string => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutos`;
  };

  const handleImageClick = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const openEditModal = (photo: ItineraryPhoto) => {
    setEditTarget(photo);
    setEditImagePreview(null);
    const currentAddress = photo.notes?.startsWith('Destino da Viagem:')
      ? photo.notes.replace('Destino da Viagem:', '').trim()
      : '';
    setEditAddress(photo.position === 'end' ? currentAddress : '');
    setEditDialogOpen(true);
  };

  const handleEditModalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = () => {
    if (!editTarget) {
      setEditDialogOpen(false);
      return;
    }
    setItineraryPhotos(prev => prev.map(p => {
      if (p.id !== editTarget.id) return p;
      const updated: ItineraryPhoto = { ...p };
      if (editImagePreview) {
        updated.photoUrl = editImagePreview;
        updated.timestamp = new Date().toISOString();
      }
      if (p.position === 'end') {
        updated.notes = editAddress ? `Destino da Viagem: ${editAddress}` : undefined;
      }
      return updated;
    }));
    setEditDialogOpen(false);
    setEditImagePreview(null);
    setEditAddress('');
    setEditTarget(null);
  };

  const handleDeletePhoto = (photoId: number) => {
    setItineraryPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Itinerário</h1>
          <p className="text-muted-foreground">
            Registro fotográfico dos painéis de instrumentos
          </p>
        </div>
        
        {isDriver && (
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Adicionar Itinerário da Viagem
          </Button>
        )}
      </div>

      {/* Barra de pesquisa (apenas para admin) */}
      {!isDriver && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar por nome do motorista ou data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPhotos.length}</div>
            <p className="text-xs text-muted-foreground">fotos enviadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Último Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {filteredPhotos[0] ? formatDate(filteredPhotos[0].timestamp) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">data/hora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Últimos 30 dias</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Linha do tempo */}
      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo</CardTitle>
          <CardDescription>
            Histórico de fotos dos painéis de instrumentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredPhotos.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum registro encontrado</h3>
                <p className="text-muted-foreground">
                  {isDriver 
                    ? "Envie sua primeira foto do painel de instrumentos"
                    : "Nenhum motorista enviou fotos do painel ainda"
                  }
                </p>
              </div>
            ) : (
              groupedPhotos.map((photoGroup, groupIndex) => (
                 <div key={groupIndex} className="space-y-4 pb-6 border-b last:border-b-0">
                   {/* Nome do motorista e data */}
                   <div className="flex items-center gap-2 mb-2">
                     <Calendar className="w-4 h-4 text-muted-foreground" />
                     <span className="text-sm font-medium">
                       {photoGroup[0].driverName} - {formatDate(photoGroup[0].timestamp)}
                     </span>
                   </div>

                  {/* Container para as fotos com placeholders */}
                  <div className="flex items-start gap-6">
                    {(() => {
                      const startPhoto = photoGroup.find(p => p.position === 'start') ?? photoGroup[0] ?? null;
                      const endPhoto = photoGroup.find(p => p.position === 'end') ?? (photoGroup.length > 1 ? photoGroup[1] : null);
                      return (
                        <>
                          <div className="flex flex-col items-center">
                            <div className="text-xs text-muted-foreground mb-2">Partida</div>
                            {startPhoto ? (
                              <>
                                <img
                                  src={startPhoto.photoUrl}
                                  alt="Partida"
                                  className="w-24 h-24 object-cover rounded-lg border-2 border-primary cursor-pointer"
                                  onClick={() => handleImageClick(startPhoto.photoUrl)}
                                />
                                <div className="text-xs text-muted-foreground mt-2 text-center max-w-24">
                                  {new Date(startPhoto.timestamp).toLocaleString('pt-BR')}
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <Button variant="outline" className="h-7 px-2 text-xs" onClick={() => openEditModal(startPhoto)}>
                                    <Edit className="w-3 h-3 mr-1" /> Editar
                                  </Button>
                                  <Button variant="outline" className="h-7 px-2 text-xs" onClick={() => handleDeletePhoto(startPhoto.id)}>
                                    <Trash className="w-3 h-3 mr-1" /> Excluir
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                                Vazio
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="text-xs text-muted-foreground mb-2">Retorno</div>
                            {endPhoto ? (
                              <>
                                <img
                                  src={endPhoto.photoUrl}
                                  alt="Retorno"
                                  className="w-24 h-24 object-cover rounded-lg border-2 border-primary cursor-pointer"
                                  onClick={() => handleImageClick(endPhoto.photoUrl)}
                                />
                                <div className="text-xs text-muted-foreground mt-2 text-center max-w-24">
                                  {new Date(endPhoto.timestamp).toLocaleString('pt-BR')}
                                </div>
                                {endPhoto.notes && endPhoto.notes.startsWith('Destino da Viagem:') && (
                                  <div className="flex items-center gap-1 mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                    <MapPin className="w-3 h-3" />
                                    <span>{endPhoto.notes.replace('Destino da Viagem:', '').trim()}</span>
                                  </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                  <Button variant="outline" className="h-7 px-2 text-xs" onClick={() => openEditModal(endPhoto)}>
                                    <Edit className="w-3 h-3 mr-1" /> Editar
                                  </Button>
                                  <Button variant="outline" className="h-7 px-2 text-xs" onClick={() => handleDeletePhoto(endPhoto.id)}>
                                    <Trash className="w-3 h-3 mr-1" /> Excluir
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-xs text-muted-foreground">
                                Vazio
                                <Button className="h-7 mt-2 px-2 text-xs" onClick={() => {
                                  const base = photoGroup.find(p => p.position === 'start') ?? photoGroup[0];
                                  if (!base) return;
                                  const newId = Math.max(...itineraryPhotos.map(p => p.id)) + 1;
                                  const newItineraryId = base.itineraryId ?? base.id;
                                  const maybeUpdatedBase = { ...base };
                                  if (!base.itineraryId) {
                                    maybeUpdatedBase.itineraryId = newItineraryId;
                                  }
                                  const newPhoto: ItineraryPhoto = {
                                    id: newId,
                                    vehicleId: base.vehicleId,
                                    driverId: base.driverId,
                                    photoUrl: '',
                                    timestamp: new Date().toISOString(),
                                    driverName: base.driverName,
                                    itineraryId: newItineraryId,
                                    position: 'end',
                                    notes: 'Retorno'
                                  };
                                  setItineraryPhotos(prev => {
                                    const replacedPrev = base.itineraryId ? prev : prev.map(p => p.id === base.id ? maybeUpdatedBase : p);
                                    return [newPhoto, ...replacedPrev];
                                  });
                                  setEditTarget(newPhoto);
                                  setEditDialogOpen(true);
                                }}>
                                  <Plus className="w-3 h-3 mr-1" /> Adicionar Retorno
                                </Button>
                              </div>
                            )}
                          </div>

                          {(startPhoto && endPhoto) && (
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-2">
                                Tempo total: {calculateTimeDifference(startPhoto.timestamp, endPhoto.timestamp)}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de upload */}
      <ItineraryUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleItineraryUpload}
      />

      {/* Modal de visualização expandida */}
      <Dialog open={!!expandedImage} onOpenChange={(open) => !open && setExpandedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-none">
          <div className="relative">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={expandedImage || ""}
              alt="Visualização expandida"
              className="w-full h-full object-contain max-h-[80vh]"
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar {editTarget?.position === 'end' ? 'Retorno' : 'Partida'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Imagem</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer" onClick={() => document.getElementById('itinerary-edit-file')?.click()}>
                {editImagePreview || editTarget?.photoUrl ? (
                  <img src={editImagePreview || editTarget?.photoUrl || ''} alt="Prévia" className="w-full h-32 object-cover rounded" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <div className="text-xs text-muted-foreground">Clique para escolher uma imagem</div>
                  </>
                )}
              </div>
              <input id="itinerary-edit-file" type="file" accept="image/*" className="hidden" onChange={handleEditModalFileSelect} />
            </div>
            {editTarget?.position === 'end' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Endereço do destino</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Digite o endereço" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveEdit}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
