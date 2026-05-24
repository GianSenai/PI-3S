import { Camera, Clock, User } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "./status-badge";
import { getEmployee, type Station } from "@/lib/mock-data";

export function StationCard({ station }: { station: Station }) {
  const employee = getEmployee(station.employeeId);
  const [open, setOpen] = useState(false);

  return (
    <Card className="overflow-hidden border-border/60 bg-card transition-colors hover:border-primary/40">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-base">{station.name}</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">{station.location}</p>
        </div>
        <StatusBadge status={station.epiStatus} />
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          {employee ? (
            <span>
              <span className="text-foreground">{employee.name}</span>
              <span className="ml-1 text-xs">• Mat. {employee.matricula}</span>
            </span>
          ) : (
            <span className="italic">Sem operador</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            <span className="text-foreground">{Math.floor(station.operationMinutes / 60)}h {station.operationMinutes % 60}min</span>{" "}
            de operação
          </span>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Confiança IA (YOLO)</span>
            <span className="font-mono text-foreground">{(station.aiConfidence * 100).toFixed(0)}%</span>
          </div>
          <Progress value={station.aiConfidence * 100} />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span
            className={`text-xs font-medium ${
              station.machineLocked ? "text-destructive" : "text-success"
            }`}
          >
            {station.machineLocked ? "● Máquina bloqueada" : "● Máquina liberada"}
          </span>
          <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
            <Camera className="mr-1.5 h-4 w-4" />
            Ver câmera
          </Button>
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{station.name} — {station.location}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-black">
            <div className="scan-line absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Camera className="mx-auto mb-2 h-10 w-10 opacity-50" />
                <p className="text-sm">Stream simulado · {station.cameraUrl}</p>
                <p className="mt-1 text-xs">YOLOv8 • detecção em {(station.aiConfidence * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="absolute left-3 top-3 rounded bg-destructive/80 px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
              ● REC
            </div>
            <div className="absolute right-3 top-3 rounded bg-black/60 px-2 py-0.5 font-mono text-xs text-white">
              {new Date().toLocaleTimeString("pt-BR")}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Operador</p>
              <p className="font-medium">{employee?.name ?? "—"}</p>
            </div>
            <div className="rounded-md border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Status EPI</p>
              <StatusBadge status={station.epiStatus} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
