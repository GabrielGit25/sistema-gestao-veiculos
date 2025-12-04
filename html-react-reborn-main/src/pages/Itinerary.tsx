import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadModal } from "@/components/shared/ImageUploadModal";
import { Calendar, Upload, Clock } from "lucide-react";

export interface ItineraryPhoto {
  id: number;
  vehicleId: number;
  driverId: number;
  photoUrl: string;
  timestamp: string;
  odometer?: string;
  notes?: string;
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
  vehicles: any[];
}

export function Itinerary({ vehicles }: ItineraryProps) {
  const { user, isDriver } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [itineraryPhotos, setItineraryPhotos] = useState<ItineraryPhoto[]>(mockItineraryPhotos);

  // Filtrar fotos baseado no tipo de usuário
  const filteredPhotos = isDriver && user?.vehicleId
    ? itineraryPhotos.filter(photo => photo.vehicleId === user.vehicleId)
    : itineraryPhotos;

  const handlePhotoUpload = (imageData: string) => {
    const newPhoto: ItineraryPhoto = {
      id: Math.max(...itineraryPhotos.map(p => p.id)) + 1,
      vehicleId: user?.vehicleId || 0,
      driverId: user?.driverId || 0,
      photoUrl: imageData,
      timestamp: new Date().toISOString(),
      odometer: "Nova leitura",
      notes: "Foto enviada"
    };
    
    setItineraryPhotos(prev => [newPhoto, ...prev]);
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
            Nova Foto
          </Button>
        )}
      </div>

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
              {filteredPhotos[0]?.odometer || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">quilometragem</p>
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
              filteredPhotos.map((photo) => (
                <div key={photo.id} className="flex gap-4 pb-6 border-b last:border-b-0">
                  <div className="flex-shrink-0">
                    <img
                      src={photo.photoUrl}
                      alt={`Painel ${formatDate(photo.timestamp)}`}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {formatDate(photo.timestamp)}
                      </span>
                    </div>
                    
                    {photo.odometer && (
                      <div className="mb-2">
                        <span className="text-sm text-muted-foreground">Quilometragem: </span>
                        <span className="text-sm font-medium">{photo.odometer}</span>
                      </div>
                    )}
                    
                    {photo.notes && (
                      <div>
                        <span className="text-sm text-muted-foreground">Observações: </span>
                        <span className="text-sm">{photo.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de upload */}
      <ImageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handlePhotoUpload}
        title="Enviar Foto do Painel"
        description="Faça upload de uma foto do painel de instrumentos para registrar a quilometragem"
      />
    </div>
  );
}