"use client";

import { useEffect, useState } from "react";
import { Camera, Maximize2, Pause, Play, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "./status-badge";
import { getEmployee, type Station } from "@/lib/mock-data";

type Props = {
  stations: Station[];
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export function CameraMonitor({ stations, selectedId, onSelect }: Props) {
  const [internalId, setInternalId] = useState<string>(selectedId ?? stations[0]?.id ?? "");
  const currentId = selectedId ?? internalId;
  const station = stations.find((s) => s.id === currentId) ?? stations[0];
  const employee = station ? getEmployee(station.employeeId) : undefined;

  const [playing, setPlaying] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => new Date());

  // Atualiza o relógio
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simula conexão com backend (pode ser melhorado depois)
  useEffect(() => {
    const timer = setTimeout(() => setConnected(true), 800);
    return () => clearTimeout(timer);
  }, [currentId]);

  const handleSelect = (id: string) => {
    if (onSelect) onSelect(id);
    else setInternalId(id);
  };

  const fullscreen = () => {
    const el = document.querySelector(".camera-container");
    if (el) (el as HTMLElement).requestFullscreen?.();
  };

  if (!station) return null;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/20 p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Câmera ao Vivo - YOLO</h3>
          <span className={`ml-2 inline-flex items-center gap-1 text-xs ${connected ? "text-success" : "text-destructive"}`}>
            {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {connected ? "Conectado" : "Conectando..."}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={station.id} onValueChange={handleSelect}>
            <SelectTrigger className="h-8 w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stations.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} — {s.sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button size="sm" variant="secondary" onClick={() => setPlaying(!playing)}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button size="sm" variant="secondary" onClick={fullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>

          <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* === ÁREA DO STREAM DO PYTHON === */}
      <div className="camera-container relative aspect-video w-full overflow-hidden bg-black">
        {playing ? (
          <img
            src="http://localhost:5000/video_feed"
            alt="Stream YOLO"
            className="h-full w-full object-cover"
            onError={() => setError("Não foi possível conectar ao stream do backend")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
            <div className="text-center">
              <Camera className="mx-auto h-16 w-16 opacity-40 mb-4" />
              <p className="text-lg">Câmera Pausada</p>
              <p className="text-sm text-gray-400">Clique em Play para iniciar</p>
            </div>
          </div>
        )}

        {/* HUD */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="flex items-center gap-1 rounded bg-destructive/80 px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> REC
          </span>
          <span className="rounded bg-black/60 px-2 py-0.5 text-xs text-white">{station.name}</span>
        </div>

        <div className="absolute right-3 top-3 rounded bg-black/60 px-2 py-0.5 font-mono text-xs text-white">
          {now.toLocaleTimeString("pt-BR")}
        </div>

        <div className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-xs text-white">
          YOLOv8 • Detecção em Tempo Real
        </div>

        <div className="absolute bottom-3 right-3">
          <StatusBadge status={station.epiStatus} />
        </div>
      </div>

      {/* Informações do Operador */}
      <div className="grid grid-cols-2 gap-3 p-3 text-sm md:grid-cols-4">
        <div>
          <p className="text-xs text-muted-foreground">Operador</p>
          <p className="font-medium">{employee?.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Matrícula</p>
          <p className="font-mono">{employee?.matricula ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Setor</p>
          <p className="font-medium">{station.sector}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Máquina</p>
          <p className={station.machineLocked ? "font-medium text-destructive" : "font-medium text-success"}>
            {station.machineLocked ? "Bloqueada" : "Liberada"}
          </p>
        </div>
      </div>
    </Card>
  );
}