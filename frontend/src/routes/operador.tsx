import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CheckCircle2, XCircle, Lock, Unlock, ShieldCheck } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { useAuth } from "@/lib/auth-context";
import { useRealtime } from "@/lib/realtime";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/operador")({
  component: () => (
    <AppLayout requireRole="operador">
      <OperadorView />
    </AppLayout>
  ),
});

function OperadorView() {
  const { user } = useAuth();
  const { stations } = useRealtime();
  const myStation = useMemo(
    () => stations.find((s) => s.employeeId === user?.id) ?? stations[0],
    [stations, user],
  );

  const compliant = myStation.epiStatus === "compliant";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Posto de trabalho</p>
        <h2 className="mt-1 text-2xl font-bold">{myStation.name}</h2>
        <p className="text-sm text-muted-foreground">{myStation.location}</p>
      </div>

      <Card
        className={`flex flex-col items-center gap-4 p-10 text-center ${
          compliant
            ? "border-success/40 bg-success/10"
            : "border-destructive/40 bg-destructive/10 pulse-danger"
        }`}
      >
        {compliant ? (
          <CheckCircle2 className="h-24 w-24 text-success" />
        ) : (
          <XCircle className="h-24 w-24 text-destructive" />
        )}
        <h3 className={`text-3xl font-bold ${compliant ? "text-success" : "text-destructive"}`}>
          {compliant ? "Você está usando EPI corretamente" : "EPI não detectado!"}
        </h3>
        <p className="max-w-md text-muted-foreground">
          {compliant
            ? "Continue assim. A IA está monitorando sua segurança em tempo real."
            : "Coloque imediatamente o EPI obrigatório. A máquina será bloqueada até a conformidade ser restaurada."}
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          className={`flex items-center gap-4 p-6 ${
            myStation.machineLocked ? "border-destructive/30" : "border-success/30"
          }`}
        >
          {myStation.machineLocked ? (
            <Lock className="h-10 w-10 text-destructive" />
          ) : (
            <Unlock className="h-10 w-10 text-success" />
          )}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Status da máquina</p>
            <p className={`text-xl font-bold ${myStation.machineLocked ? "text-destructive" : "text-success"}`}>
              {myStation.machineLocked ? "Bloqueada" : "Liberada"}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-6">
          <ShieldCheck className="h-10 w-10 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Confiança IA</p>
            <p className="text-xl font-bold">{(myStation.aiConfidence * 100).toFixed(0)}%</p>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Instruções de segurança</h4>
        <ul className="space-y-1.5 text-sm">
          <li>✓ Use capacete de solda, luvas e óculos a todo momento.</li>
          <li>✓ Não remova o EPI durante a operação da máquina.</li>
          <li>✓ Em caso de pausa, sinalize ao supervisor antes de retirar o equipamento.</li>
          <li>✓ Em caso de alerta, a máquina é bloqueada automaticamente.</li>
        </ul>
      </Card>
    </div>
  );
}
