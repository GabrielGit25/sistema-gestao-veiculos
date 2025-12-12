import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Calendar, MapPin, FileText, Plus, X, Upload } from "lucide-react";
import { initialVehicles } from "@/data/mockData";

export type VehicleInfraction = {
  id: number;
  vehicleId: number;
  driverName: string;
  date: string;
  address: string;
  description: string;
  attachment?: string;
};

interface InfractionsProps {
  infractions: VehicleInfraction[];
  onUpdateInfractions: (infractions: VehicleInfraction[]) => void;
}

export function Infractions({ infractions, onUpdateInfractions }: InfractionsProps) {
  const { isAdmin, user } = useAuth();
  const [showNewInfraction, setShowNewInfraction] = useState(false);
  const [form, setForm] = useState<Partial<VehicleInfraction>>({ date: new Date().toISOString().split("T")[0] });
  const handleAttachmentFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm({ ...form, attachment: url });
  };

  const filtered = isAdmin || !user?.vehicleId
    ? infractions
    : infractions.filter(i => i.vehicleId === user.vehicleId);

  const handleAdd = () => {
    if (!form.vehicleId || !form.description || !form.date || !form.address) return;
    const v = initialVehicles.find(v => v.id === form.vehicleId);
    const item: VehicleInfraction = {
      id: Math.max(0, ...infractions.map(i => i.id)) + 1,
      vehicleId: form.vehicleId,
      driverName: v?.motorista || "-",
      date: form.date,
      address: form.address,
      description: form.description,
      attachment: form.attachment,
    };
    onUpdateInfractions([item, ...infractions]);
    setForm({ date: new Date().toISOString().split("T")[0] });
    setShowNewInfraction(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Infrações</h1>
          <p className="text-muted-foreground">Histórico de multas vinculadas ao veículo e condutor</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowNewInfraction(!showNewInfraction)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Infração
          </Button>
        )}
      </div>

      {showNewInfraction && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nova Infração</CardTitle>
            <CardDescription>Registre uma multa para o veículo atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                value={form.vehicleId?.toString()}
                onValueChange={(v) => setForm({ ...form, vehicleId: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Veículo" />
                </SelectTrigger>
                <SelectContent>
                  {initialVehicles.map(v => (
                    <SelectItem key={v.id} value={v.id.toString()}>
                      {v.placa} - {v.marca} {v.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={form.date || ""}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="Data"
              />

              <Input
                placeholder="Endereço do acontecimento"
                value={form.address || ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <Input
                placeholder="Descrição"
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div>
                <label className="text-sm font-medium mb-2 block">Anexo (opcional)</label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
                  onClick={() => document.getElementById('infraction-attachment-file')?.click()}
                >
                  {form.attachment ? (
                    <div className="text-sm">Arquivo selecionado</div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <div className="text-xs text-muted-foreground">Clique para escolher um arquivo</div>
                    </>
                  )}
                </div>
                <input
                  id="infraction-attachment-file"
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleAttachmentFile}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAdd}>Adicionar</Button>
              <Button variant="outline" onClick={() => setShowNewInfraction(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filtered.map((i) => (
          <Card key={i.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h3 className="font-semibold text-lg">{i.description}</h3>
                    </div>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" onClick={() => onUpdateInfractions(infractions.filter(x => x.id !== i.id))}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(i.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{i.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {initialVehicles.find(v => v.id === i.vehicleId)?.placa}
                      </span>
                      <span className="text-muted-foreground">• {i.driverName}</span>
                    </div>
                    {i.attachment && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <a href={i.attachment} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                          Anexo
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
