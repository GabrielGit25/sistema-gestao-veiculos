import { useState, useRef } from "react";
import { Upload, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ItineraryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: {
    startPhoto: string;
    endPhoto: string;
    endAddress: string;
    startTimestamp?: string;
    endTimestamp?: string;
  }) => void;
}

export function ItineraryUploadModal({ isOpen, onClose, onUpload }: ItineraryUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPreview, setStartPreview] = useState<string | null>(null);
  const [endPreview, setEndPreview] = useState<string | null>(null);
  const [startTimestamp, setStartTimestamp] = useState<string | null>(null);
  const [endTimestamp, setEndTimestamp] = useState<string | null>(null);
  const [endAddress, setEndAddress] = useState("");
  const [currentUpload, setCurrentUpload] = useState<'start' | 'end'>('start');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const timestamp = new Date().toISOString();
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (currentUpload === 'start') {
        setStartPreview(result);
        setStartTimestamp(timestamp);
      } else {
        setEndPreview(result);
        setEndTimestamp(timestamp);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].type.startsWith('image/')) {
      handleFile(files[0]);
    }
  };

  const handleUpload = () => {
    onUpload({
      startPhoto: startPreview || "",
      endPhoto: endPreview || "",
      endAddress,
      startTimestamp: startTimestamp || new Date().toISOString(),
      endTimestamp: endTimestamp || new Date().toISOString()
    });
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStartPreview(null);
    setEndPreview(null);
    setStartTimestamp(null);
    setEndTimestamp(null);
    setEndAddress("");
    setCurrentUpload('start');
  };

  const isFormValid = true;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Adicionar Itinerário da Viagem</h3>
          <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Foto de Partida */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Ponto de Partida</h4>
            
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                isDragging ? 'border-primary bg-secondary' : 'border-border'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                setCurrentUpload('start');
                fileInputRef.current?.click();
              }}
            >
              {startPreview ? (
                <img src={startPreview} alt="Partida" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Clique para adicionar foto de partida (opcional)</p>
                </>
              )}
            </div>
          </div>

          {/* Foto de Destino */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Destino</h4>
            
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                isDragging ? 'border-primary bg-secondary' : 'border-border'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                setCurrentUpload('end');
                fileInputRef.current?.click();
              }}
            >
              {endPreview ? (
                <img src={endPreview} alt="Destino" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Clique para adicionar foto de retorno (opcional)</p>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-address">Destino da Viagem</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="end-address"
                  placeholder="Cole o endereço do destino"
                  value={endAddress}
                  onChange={(e) => setEndAddress(e.target.value)}
                  className="pl-10"
                />
              </div>
              {endAddress && (
                <div className="flex items-center gap-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  <MapPin className="w-3 h-3" />
                  <span>{endAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!isFormValid}>
            Salvar Itinerário
          </Button>
        </div>
      </div>
    </div>
  );
}
