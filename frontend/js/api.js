/* API client — aponta para endpoints PHP do backend.
   Ajuste BASE_URL conforme onde sua API PHP estiver hospedada. */
const API = {
  BASE_URL: "/api", // ex.: http://localhost:8000/api  (endpoints .php)
  USE_MOCK_FALLBACK: true, // se a API falhar, usa dados do mock-data.js

  async _req(path, opts = {}) {
    const url = `${this.BASE_URL}${path}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      credentials: "include",
      ...opts,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // ===== Auth =====
  login(matricula, password) { return this._req("/login.php", { method: "POST", body: { matricula, password } }); },
  logout()                   { return this._req("/logout.php", { method: "POST" }); },

  // ===== Estações / Monitoramento =====
  listStations()             { return this._req("/stations.php"); },
  getStation(id)             { return this._req(`/stations.php?id=${encodeURIComponent(id)}`); },
  updateStation(id, data)    { return this._req(`/stations.php?id=${encodeURIComponent(id)}`, { method: "PUT", body: data }); },

  // ===== Funcionários =====
  listEmployees()            { return this._req("/employees.php"); },
  saveEmployee(data)         { return this._req("/employees.php", { method: data.id ? "PUT" : "POST", body: data }); },
  deleteEmployee(id)         { return this._req(`/employees.php?id=${encodeURIComponent(id)}`, { method: "DELETE" }); },

  // ===== Eventos / Logs =====
  listEvents(params = {})    {
    const q = new URLSearchParams(params).toString();
    return this._req(`/events.php${q ? "?" + q : ""}`);
  },

  // ===== Relatórios =====
  getComplianceTrend()       { return this._req("/reports.php?type=trend"); },
  getViolationsByEmployee()  { return this._req("/reports.php?type=violations"); },

  // ===== Configurações =====
  getSettings()              { return this._req("/settings.php"); },
  saveSettings(data)         { return this._req("/settings.php", { method: "PUT", body: data }); },

  // ===== Câmera (stream) =====
  // Retorne do PHP a URL real do stream (MJPEG/HLS) por estação.
  getCameraUrl(stationId)    { return this._req(`/camera.php?stationId=${encodeURIComponent(stationId)}`); },
};

/* Helper: tenta API; se falhar e USE_MOCK_FALLBACK = true, usa MOCK. */
async function tryApi(call, mockValue) {
  try { return await call(); }
  catch (e) {
    if (API.USE_MOCK_FALLBACK) { console.warn("[API] usando MOCK:", e.message); return mockValue; }
    throw e;
  }
}
