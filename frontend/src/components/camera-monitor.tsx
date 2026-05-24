import { useEffect, useRef, useState } from "react";
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

/**
 * CameraMonitor
 * ------------------------------------------------------------------
 * Painel de vídeo pronto para receber o stream real da câmera.
 *
 * INTEGRAÇÃO (backend / câmera IP):
 *   - MJPEG  → use <img src={station.cameraUrl} /> (já suportado abaixo).
 *   - HLS    → troque o <img> por <video> + hls.js apontando para .m3u8
 *   - WebRTC → conecte um MediaStream em videoRef.current.srcObject
 *   - Socket.io frames → atribua data URLs a <img> em cada "frame" recebido
 *
 * O endpoint esperado vem de `station.cameraUrl` (ex.: rtsp://, http://.../stream.mjpg).
 * ------------------------------------------------------------------
 */
export function CameraMonitor({ stations, selectedId, onSelect }: Props) {
  const [internalId, setInternalId] = useState<string>(selectedId ?? stations[0]?.id ?? "");
  const currentId = selectedId ?? internalId;
  const station = stations.find((s) => s.id === currentId) ?? stations[0];
  const employee = station ? getEmployee(station.employeeId) : undefined;

  const [playing, setPlaying] = useState(true);
  const [connected, setConnected] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Hook de conexão: troque por socket.io / WebRTC quando o backend estiver pronto.
  useEffect(() => {
    if (!station) return;
    setConnected(false);
    const t = setTimeout(() => setConnected(true), 600);
    return () => clearTimeout(t);
  }, [station?.id]);

  const handleSelect = (id: string) => {
    if (onSelect) onSelect(id);
    else setInternalId(id);
  };

  const fullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  if (!station) return null;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/20 p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Câmera ao vivo</h3>
          <span
            className={`ml-2 inline-flex items-center gap-1 text-xs ${
              connected ? "text-success" : "text-muted-foreground"
            }`}
          >
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
          <Button size="sm" variant="secondary" onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => { setConnected(false); setTimeout(() => setConnected(true), 500); }}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={fullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="relative aspect-video w-full overflow-hidden bg-black">
        {/*
          Substitua o bloco abaixo pela tag real do stream:
          <img src={station.cameraUrl} alt="stream" className="h-full w-full object-cover" />
          ou
          <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
        */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover opacity-0"
          data-camera-url={station.cameraUrl}
        />
        {playing && <div className="scan-line absolute inset-0" />}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Camera className="mx-auto mb-2 h-12 w-12 opacity-40" />
            <p className="text-sm">Aguardando stream do backend</p>
            <p className="mt-1 font-mono text-xs">{station.cameraUrl}</p>
          </div>
        </div>

        {/* Overlays HUD */}
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
          YOLOv8 · {(station.aiConfidence * 100).toFixed(0)}% confiança
        </div>
        <div className="absolute bottom-3 right-3">
          <StatusBadge status={station.epiStatus} />
        </div>
      </div>

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
