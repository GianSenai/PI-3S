import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertTriangle, ShieldCheck, Factory } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { StationCard } from "@/components/station-card";
import { Card, CardContent } from "@/components/ui/card";
import { useRealtime } from "@/lib/realtime";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppLayout requireRole="supervisor">
      <Dashboard />
    </AppLayout>
  );
}

function Dashboard() {
  const { stations } = useRealtime();
  const active = stations.filter((s) => s.epiStatus !== "offline").length;
  const compliant = stations.filter((s) => s.epiStatus === "compliant").length;
  const violations = stations.filter((s) => s.epiStatus === "violation").length;
  const compliancePct = active ? Math.round((compliant / active) * 100) : 0;

  const compTone =
    compliancePct >= 85 ? "text-success" : compliancePct >= 65 ? "text-warning" : "text-destructive";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Visão geral — Tempo real</h2>
        <p className="text-sm text-muted-foreground">Monitoramento contínuo das estações de solda com IA YOLO.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat icon={Factory} label="Estações ativas" value={`${active}/${stations.length}`} tint="text-primary" />
        <Stat
          icon={ShieldCheck}
          label="Conformidade geral"
          value={`${compliancePct}%`}
          tint={compTone}
        />
        <Stat
          icon={AlertTriangle}
          label="Alertas ativos"
          value={String(violations)}
          tint={violations ? "text-destructive" : "text-success"}
        />
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Grid de estações
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stations.map((s) => (
            <StationCard key={s.id} station={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className={`mt-2 text-4xl font-bold ${tint}`}>{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted/40 ${tint}`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
