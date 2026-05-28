/* Auth simples: tenta API PHP, cai para mock. Persiste no localStorage. */
const AUTH = {
  KEY: "epi-guardian-user",
  get user() { try { return JSON.parse(localStorage.getItem(this.KEY) || "null"); } catch { return null; } },
  set user(v) { v ? localStorage.setItem(this.KEY, JSON.stringify(v)) : localStorage.removeItem(this.KEY); },

  async login(matricula, password) {
    const u = await tryApi(
      () => API.login(matricula, password),
      MOCK.employees.find(e => e.matricula === String(matricula).trim()) || null
    );
    if (!u) throw new Error("Matrícula não encontrada");
    this.user = u;
    return u;
  },
  logout() {
    tryApi(() => API.logout(), null).catch(()=>{});
    this.user = null;
    location.href = "index.html";
  },
  requireRole(role) {
    const u = this.user;
    if (!u) { location.href = "index.html"; return null; }
    if (role && u.role !== role) {
      location.href = u.role === "supervisor" ? "dashboard.html" : "operador.html";
      return null;
    }
    return u;
  }
};

/* Toast helper */
function toast(title, desc, type="info") {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<div class="t">${title}</div>${desc?`<div class="d">${desc}</div>`:""}`;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}
