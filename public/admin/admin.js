/* =========================
   AUTH
========================= */

const token = localStorage.getItem("adminToken");

// Si no hay token → login
if (!token) {
  location.href = "/admin/login.html";
}

/**
 * Fetch helper con Authorization
 */
async function authFetch(url) {
  const res = await fetch(url, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  if (res.status === 401 || res.status === 403) {
    console.warn("Auth inválida, volviendo a login");
    localStorage.removeItem("adminToken");
    location.href = "/admin/login.html";
    return null;
  }

  if (!res.ok) {
    console.error("Error en request:", res.status);
    return null;
  }

  return res;
}

/* =========================
   UTILIDADES
========================= */

// Convertir country code a emoji 🇦🇷 🇺🇸
function flagEmoji(code) {
  if (!code || code === "XX") return "🏳️";
  return code
    .toUpperCase()
    .replace(/./g, c =>
      String.fromCodePoint(127397 + c.charCodeAt())
    );
}

// Formatear hora
function formatTime(date) {
  return new Date(date).toLocaleTimeString();
}

/* =========================
   LOGS
========================= */
async function loadLogs() {
  const res = await authFetch("/admin/logs");
  if (!res) return;

  const data = await res.json();

  // Total requests
  const totalEl = document.getElementById("total");
  if (totalEl) totalEl.textContent = data.length;

  const list = document.getElementById("logList");
  if (!list) return;

  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = "<p style='opacity:.6'>No hay logs todavía</p>";
    return;
  }

  data.forEach(log => {
    const div = document.createElement("div");
    div.className = "log";

    div.innerHTML = `
      <div class="flag">${flagEmoji(log.country)}</div>

      <div class="info">
        <strong>${log.method}</strong>
        <span class="path">${log.path}</span>
        <small>${log.ip} • ${log.ua}</small>
      </div>

      <div class="time">${formatTime(log.time)}</div>
    `;

    list.appendChild(div);
  });
}

/* =========================
   STATS POR ENDPOINT
========================= */
async function loadStats() {
  const res = await authFetch("/admin/stats");
  if (!res) return;

  const stats = await res.json();

  const ul = document.getElementById("endpointList");
  if (!ul) return;

  ul.innerHTML = "";

  const entries = Object.entries(stats);

  if (entries.length === 0) {
    ul.innerHTML = "<li style='opacity:.6'>Sin datos</li>";
    return;
  }

  entries.forEach(([path, count]) => {
    const li = document.createElement("li");
    li.textContent = `${path} → ${count}`;
    ul.appendChild(li);
  });
}

/* =========================
   CHART
========================= */
let chart;

async function loadChart() {
  const res = await authFetch("/admin/stats");
  if (!res) return;

  const data = await res.json();

  const canvas = document.getElementById("chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (chart) chart.destroy();

  const labels = Object.keys(data);
  const values = Object.values(data);

  if (labels.length === 0) return;

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Requests",
        data: values,
        backgroundColor: "#6c63ff"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

/* =========================
   REFRESH
========================= */
async function refreshAll() {
  await loadLogs();
  await loadStats();
  await loadChart();
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  refreshAll();

  // Botón actualizar (si existe)
  const btn = document.getElementById("refreshBtn");
  if (btn) btn.addEventListener("click", refreshAll);
});
