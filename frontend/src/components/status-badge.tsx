import { CheckCircle2, AlertTriangle, PauseCircle, PowerOff } from "lucide-react";
import type { EpiStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const map: Record<EpiStatus, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  compliant: { label: "Conforme", cls: "bg-success/15 text-success border-success/30", Icon: CheckCircle2 },
  violation: { label: "Violação", cls: "bg-destructive/15 text-destructive border-destructive/40", Icon: AlertTriangle },
  paused: { label: "Pausa segura", cls: "bg-warning/15 text-warning border-warning/30", Icon: PauseCircle },
  offline: { label: "Offline", cls: "bg-muted text-muted-foreground border-border", Icon: PowerOff },
};

export function StatusBadge({ status, className }: { status: EpiStatus; className?: string }) {
  const { label, cls, Icon } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
        cls,
        status === "violation" && "pulse-danger",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
