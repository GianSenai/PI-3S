import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { StatusBadge } from "@/components/status-badge";
import { CameraMonitor } from "@/components/camera-monitor";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRealtime } from "@/lib/realtime";
import { getEmployee, stations as allStations } from "@/lib/mock-data";

export const Route = createFileRoute("/monitoramento")({
  component: () => (
    <AppLayout requireRole="supervisor">
      <Monitoramento />
    </AppLayout>
  ),
});

function Monitoramento() {
  const { stations, events } = useRealtime();
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const sectors = useMemo(() => Array.from(new Set(allStations.map((s) => s.sector))), []);
  const filtered = stations.filter((s) => {
    const emp = getEmployee(s.employeeId);
    const hit =
      !q ||
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      emp?.name.toLowerCase().includes(q.toLowerCase()) ||
      emp?.matricula.includes(q);
    return hit && (sector === "all" || s.sector === sector) && (status === "all" || s.epiStatus === status);
  });

  const activeAlerts = stations.filter((s) => s.epiStatus === "violation");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Monitoramento em tempo real</h2>
        <p className="text-sm text-muted-foreground">Estações, status atual e alertas ativos.</p>
      </div>

      {activeAlerts.length > 0 && (
        <Card className="border-destructive/40 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="font-semibold text-destructive">
                {activeAlerts.length} alerta(s) ativo(s) — intervenção necessária
              </p>
              <ul className="mt-1 space-y-0.5 text-sm">
                {activeAlerts.map((a) => (
                  <li key={a.id} className="text-foreground/90">
                    • {a.name} — {getEmployee(a.employeeId)?.name ?? "Sem operador"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <CameraMonitor stations={stations} />



      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar estação, funcionário ou matrícula..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Setor" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os setores</SelectItem>
            {sectors.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="compliant">Conforme</SelectItem>
            <SelectItem value="violation">Violação</SelectItem>
            <SelectItem value="paused">Pausa segura</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estação</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead>Status EPI</TableHead>
              <TableHead className="text-right">Confiança IA</TableHead>
              <TableHead className="text-right">Operação</TableHead>
              <TableHead>Máquina</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => {
              const emp = getEmployee(s.employeeId);
              return (
                <TableRow key={s.id} className={s.epiStatus === "violation" ? "bg-destructive/5" : ""}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.sector}</TableCell>
                  <TableCell>{emp ? `${emp.name} (${emp.matricula})` : <span className="italic text-muted-foreground">—</span>}</TableCell>
                  <TableCell><StatusBadge status={s.epiStatus} /></TableCell>
                  <TableCell className="text-right font-mono">{(s.aiConfidence * 100).toFixed(0)}%</TableCell>
                  <TableCell className="text-right font-mono">{Math.floor(s.operationMinutes / 60)}h{String(s.operationMinutes % 60).padStart(2, "0")}</TableCell>
                  <TableCell>
                    <span className={s.machineLocked ? "text-destructive" : "text-success"}>
                      {s.machineLocked ? "Bloqueada" : "Liberada"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Nenhuma estação encontrada.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Stream de eventos</h3>
        <Card className="divide-y divide-border">
          {events.slice(0, 10).map((e) => {
            const emp = getEmployee(e.employeeId);
            const isAlert = e.type === "alert_triggered";
            return (
              <div key={e.id} className={`flex items-center justify-between gap-4 p-3 text-sm ${isAlert ? "bg-destructive/5" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${isAlert ? "bg-destructive" : "bg-success"}`} />
                  <div>
                    <p className="font-medium">{e.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {emp?.name ?? "—"} · {e.stationId} · {new Date(e.timestamp).toLocaleTimeString("pt-BR")}
                    </p>
                  </div>
                </div>
                {e.confidence && (
                  <span className="font-mono text-xs text-muted-foreground">{(e.confidence * 100).toFixed(0)}%</span>
                )}
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
