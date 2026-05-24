import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { complianceTrend, employees, getEmployee, stations, violationsByEmployee } from "@/lib/mock-data";
import { useRealtime } from "@/lib/realtime";
import { toast } from "sonner";

export const Route = createFileRoute("/relatorios")({
  component: () => (
    <AppLayout requireRole="supervisor">
      <Relatorios />
    </AppLayout>
  ),
});

const typeLabel: Record<string, string> = {
  epi_detected: "EPI detectado",
  epi_removed: "EPI removido",
  alert_triggered: "Alerta",
  safe_pause: "Pausa segura",
  machine_locked: "Bloqueio",
  machine_released: "Liberação",
};

function Relatorios() {
  const { events } = useRealtime();
  const [q, setQ] = useState("");
  const [employee, setEmployee] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(0);
  const PER = 10;

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        const emp = getEmployee(e.employeeId);
        const hit = !q || e.message.toLowerCase().includes(q.toLowerCase()) || emp?.name.toLowerCase().includes(q.toLowerCase());
        return hit && (employee === "all" || e.employeeId === employee) && (type === "all" || e.type === type);
      }),
    [events, q, employee, type],
  );
  const pageItems = filtered.slice(page * PER, page * PER + PER);

  const exportCSV = () => {
    const header = "timestamp,estacao,funcionario,tipo,mensagem,confianca\n";
    const rows = filtered
      .map((e) => {
        const emp = getEmployee(e.employeeId);
        const st = stations.find((s) => s.id === e.stationId);
        return [e.timestamp, st?.name, emp?.name ?? "", e.type, e.message, e.confidence ?? ""].join(",");
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `epi-relatorio-${Date.now()}.csv`;
    a.click();
    toast.success("CSV exportado");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Histórico e relatórios</h2>
          <p className="text-sm text-muted-foreground">Logs de eventos, conformidade e violações.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" /> CSV</Button>
          <Button variant="outline" onClick={() => toast.message("PDF em geração...")}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Conformidade — últimos 7 dias</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.025 250)" />
                <XAxis dataKey="day" stroke="oklch(0.7 0.02 250)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0.02 250)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.025 250)", border: "1px solid oklch(0.32 0.025 250)", borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="conformidade" stroke="oklch(0.7 0.18 145)" strokeWidth={2.5} name="Conformidade %" />
                <Line type="monotone" dataKey="violacoes" stroke="oklch(0.62 0.24 25)" strokeWidth={2.5} name="Violações" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Violações por funcionário</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationsByEmployee}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.025 250)" />
                <XAxis dataKey="name" stroke="oklch(0.7 0.02 250)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0.02 250)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.025 250)", border: "1px solid oklch(0.32 0.025 250)", borderRadius: 8 }} />
                <Bar dataKey="violacoes" fill="oklch(0.65 0.16 240)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Log de eventos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <Input placeholder="Buscar..." value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
            <Select value={employee} onValueChange={(v) => { setEmployee(v); setPage(0); }}>
              <SelectTrigger className="md:w-56"><SelectValue placeholder="Funcionário" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos funcionários</SelectItem>
                {employees.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={(v) => { setType(v); setPage(0); }}>
              <SelectTrigger className="md:w-48"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos tipos</SelectItem>
                {Object.entries(typeLabel).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quando</TableHead>
                <TableHead>Estação</TableHead>
                <TableHead>Funcionário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead className="text-right">IA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((e) => {
                const emp = getEmployee(e.employeeId);
                const st = stations.find((s) => s.id === e.stationId);
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs">{new Date(e.timestamp).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{st?.name ?? e.stationId}</TableCell>
                    <TableCell>{emp?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={e.type === "alert_triggered" ? "destructive" : "secondary"}>{typeLabel[e.type]}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{e.message}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{e.confidence ? `${(e.confidence * 100).toFixed(0)}%` : "—"}</TableCell>
                  </TableRow>
                );
              })}
              {pageItems.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Nenhum evento.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Página {page + 1} de {Math.max(1, Math.ceil(filtered.length / PER))} — {filtered.length} eventos</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
              <Button size="sm" variant="outline" disabled={(page + 1) * PER >= filtered.length} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
