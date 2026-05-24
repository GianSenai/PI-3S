import { useEffect, useState } from "react";
import { initialEvents, stations as seedStations, type EventLog, type Station, type EpiStatus, getEmployee } from "./mock-data";
import { toast } from "sonner";

// Simulated Socket.io: emits random EPI updates every few seconds.
type Listener = (s: Station[], e: EventLog[]) => void;

let _stations: Station[] = seedStations.map((s) => ({ ...s }));
let _events: EventLog[] = [...initialEvents];
const listeners = new Set<Listener>();
let started = false;

function emit() {
  for (const l of listeners) l([..._stations], [..._events]);
}

function tick() {
  // Increment operation time
  _stations = _stations.map((s) =>
    s.epiStatus === "offline" ? s : { ...s, operationMinutes: s.operationMinutes + 1 },
  );

  // Random event on a non-offline station
  if (Math.random() < 0.55) {
    const candidates = _stations.filter((s) => s.epiStatus !== "offline");
    if (candidates.length) {
      const st = candidates[Math.floor(Math.random() * candidates.length)];
      const r = Math.random();
      let next: EpiStatus = st.epiStatus;
      let evt: EventLog | null = null;
      const confidence = +(0.75 + Math.random() * 0.24).toFixed(2);

      if (r < 0.15 && st.epiStatus === "compliant") {
        next = "violation";
        evt = {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          stationId: st.id,
          employeeId: st.employeeId,
          type: "alert_triggered",
          message: "EPI removido durante operação",
          confidence,
        };
      } else if (r < 0.3 && st.epiStatus === "violation") {
        next = "compliant";
        evt = {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          stationId: st.id,
          employeeId: st.employeeId,
          type: "machine_released",
          message: "Conformidade restaurada — máquina liberada",
          confidence,
        };
      } else if (r < 0.4) {
        evt = {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          stationId: st.id,
          employeeId: st.employeeId,
          type: "epi_detected",
          message: "EPI completo confirmado",
          confidence,
        };
      }

      if (next !== st.epiStatus || evt) {
        _stations = _stations.map((s) =>
          s.id === st.id
            ? { ...s, epiStatus: next, machineLocked: next === "violation", aiConfidence: confidence }
            : s,
        );
      }
      if (evt) {
        _events = [evt, ..._events].slice(0, 200);
        if (evt.type === "alert_triggered") {
          const emp = getEmployee(evt.employeeId);
          toast.error(`Alerta — ${st.name}`, {
            description: `${emp?.name ?? "Operador"} • ${evt.message}`,
          });
        }
      }
    }
  }

  emit();
}

function ensureStarted() {
  if (started || typeof window === "undefined") return;
  started = true;
  setInterval(tick, 4000);
}

export function useRealtime() {
  const [stations, setStations] = useState<Station[]>(_stations);
  const [events, setEvents] = useState<EventLog[]>(_events);

  useEffect(() => {
    ensureStarted();
    const listener: Listener = (s, e) => {
      setStations(s);
      setEvents(e);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { stations, events };
}
