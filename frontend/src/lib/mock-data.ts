export type EpiStatus = "compliant" | "violation" | "paused" | "offline";

export interface Employee {
  id: string;
  matricula: string;
  name: string;
  role: "operador" | "supervisor";
  sector: string;
}

export interface Station {
  id: string;
  name: string;
  sector: string;
  location: string;
  employeeId: string | null;
  epiStatus: EpiStatus;
  aiConfidence: number; // 0..1
  operationMinutes: number;
  cameraUrl: string;
  machineLocked: boolean;
}

export interface EventLog {
  id: string;
  timestamp: string;
  stationId: string;
  employeeId: string | null;
  type: "epi_detected" | "epi_removed" | "alert_triggered" | "safe_pause" | "machine_locked" | "machine_released";
  message: string;
  confidence?: number;
}

export const employees: Employee[] = [
  { id: "e1", matricula: "10234", name: "Carlos Mendes", role: "operador", sector: "Solda A" },
  { id: "e2", matricula: "10235", name: "Joana Ribeiro", role: "operador", sector: "Solda B" },
  { id: "e3", matricula: "10236", name: "Pedro Alves", role: "operador", sector: "Corte" },
  { id: "e4", matricula: "10237", name: "Mariana Costa", role: "operador", sector: "Solda A" },
  { id: "e5", matricula: "10238", name: "Rafael Souza", role: "operador", sector: "Montagem" },
  { id: "e6", matricula: "10239", name: "Lucas Pereira", role: "operador", sector: "Solda B" },
  { id: "s1", matricula: "20001", name: "Ana Lima", role: "supervisor", sector: "Geral" },
];

export const stations: Station[] = [
  { id: "st-01", name: "Estação Solda #01", sector: "Solda A", location: "Setor A — Linha 1", employeeId: "e1", epiStatus: "compliant", aiConfidence: 0.96, operationMinutes: 142, cameraUrl: "cam-01", machineLocked: false },
  { id: "st-02", name: "Estação Solda #02", sector: "Solda A", location: "Setor A — Linha 2", employeeId: "e4", epiStatus: "violation", aiConfidence: 0.91, operationMinutes: 78, cameraUrl: "cam-02", machineLocked: true },
  { id: "st-03", name: "Estação Solda #03", sector: "Solda B", location: "Setor B — Linha 1", employeeId: "e2", epiStatus: "compliant", aiConfidence: 0.88, operationMinutes: 210, cameraUrl: "cam-03", machineLocked: false },
  { id: "st-04", name: "Estação Solda #04", sector: "Solda B", location: "Setor B — Linha 2", employeeId: "e6", epiStatus: "paused", aiConfidence: 0.84, operationMinutes: 35, cameraUrl: "cam-04", machineLocked: true },
  { id: "st-05", name: "Estação Corte #01", sector: "Corte", location: "Setor C — Linha 1", employeeId: "e3", epiStatus: "compliant", aiConfidence: 0.94, operationMinutes: 167, cameraUrl: "cam-05", machineLocked: false },
  { id: "st-06", name: "Estação Montagem #01", sector: "Montagem", location: "Setor D — Linha 1", employeeId: "e5", epiStatus: "compliant", aiConfidence: 0.92, operationMinutes: 53, cameraUrl: "cam-06", machineLocked: false },
  { id: "st-07", name: "Estação Solda #05", sector: "Solda A", location: "Setor A — Linha 3", employeeId: null, epiStatus: "offline", aiConfidence: 0, operationMinutes: 0, cameraUrl: "cam-07", machineLocked: true },
  { id: "st-08", name: "Estação Solda #06", sector: "Solda B", location: "Setor B — Linha 3", employeeId: null, epiStatus: "offline", aiConfidence: 0, operationMinutes: 0, cameraUrl: "cam-08", machineLocked: true },
];

const now = Date.now();
const ago = (m: number) => new Date(now - m * 60_000).toISOString();

export const initialEvents: EventLog[] = [
  { id: "ev1", timestamp: ago(2), stationId: "st-02", employeeId: "e4", type: "alert_triggered", message: "Capacete removido durante operação", confidence: 0.94 },
  { id: "ev2", timestamp: ago(5), stationId: "st-02", employeeId: "e4", type: "machine_locked", message: "Máquina bloqueada por violação de EPI" },
  { id: "ev3", timestamp: ago(12), stationId: "st-04", employeeId: "e6", type: "safe_pause", message: "Pausa segura iniciada" },
  { id: "ev4", timestamp: ago(18), stationId: "st-01", employeeId: "e1", type: "epi_detected", message: "EPI completo detectado", confidence: 0.96 },
  { id: "ev5", timestamp: ago(34), stationId: "st-03", employeeId: "e2", type: "epi_detected", message: "EPI completo detectado", confidence: 0.88 },
  { id: "ev6", timestamp: ago(48), stationId: "st-05", employeeId: "e3", type: "machine_released", message: "Máquina liberada após conformidade" },
  { id: "ev7", timestamp: ago(72), stationId: "st-06", employeeId: "e5", type: "epi_detected", message: "EPI completo detectado", confidence: 0.92 },
  { id: "ev8", timestamp: ago(95), stationId: "st-01", employeeId: "e1", type: "alert_triggered", message: "Óculos de proteção não detectados", confidence: 0.78 },
  { id: "ev9", timestamp: ago(140), stationId: "st-03", employeeId: "e2", type: "safe_pause", message: "Pausa segura concluída" },
  { id: "ev10", timestamp: ago(200), stationId: "st-04", employeeId: "e6", type: "epi_removed", message: "Luva de proteção removida", confidence: 0.81 },
];

export const complianceTrend = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(now - (6 - i) * 86_400_000);
  return {
    day: d.toLocaleDateString("pt-BR", { weekday: "short" }),
    conformidade: 80 + Math.round(Math.random() * 18),
    violacoes: Math.round(Math.random() * 12),
  };
});

export const violationsByEmployee = employees
  .filter((e) => e.role === "operador")
  .map((e) => ({ name: e.name.split(" ")[0], violacoes: Math.round(Math.random() * 9) }));

export function getEmployee(id: string | null): Employee | undefined {
  if (!id) return undefined;
  return employees.find((e) => e.id === id);
}
