/* =========================
   AUTH
========================= */

const token = localStorage.getItem("adminToken");

if (!token) {
  location.href = "/admin/login.html";
}

/* helper fetch con auth */
async function authFetch(url) {
  const res = await fetch(url, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("adminToken");
    location.href = "/admin/login.html";
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

function formatTime(date) {
  return new Date(date).toLocaleTimeString();
}

/* =========================
   LOGS
========================= */
async function loadLogs() {
  const res = await authFetch("/api/admin/logs");
  if (!res) return;

  const data = await res.json();

  const totalEl = document.getElementById("total");
  if (totalEl) totalEl.textContent = data.length;

  const list = document.getElementById("logList");
  list.innerHTML = "";

  data.forEach(log => {
    const div = document.createElement("div");
    div.className = "log";

    div.innerHTML = `
      <div class="flag">${flagEmoji(log.country)}</div>
      <div class="info">
        <strong>${log.method}</strong> ${log.path}<br/>
        <small>${log.ip} • ${log.ua}</small>
      </div>
      <div class="time">${formatTime(log.time)}</div>
    `;

    list.appendChild(div);
  });
}

/* =========================
   STATS
========================= */
async function loadStats() {
  const res = await authFetch("/api/admin/stats");
  if (!res) return;

  const stats = await res.json();

  const ul = document.getElementById("endpointList");
  if (!ul) return;

  ul.innerHTML = "";

  Object.entries(stats).forEach(([path, count]) => {
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
  const res = await authFetch("/api/admin/stats");
  if (!res) return;

  const data = await res.json();

  const canvas = document.getElementById("chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: "Requests",
        data: Object.values(data),
        backgroundColor: "#6c63ff"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

/* =========================
   INIT
========================= */
async function refreshAll() {
  await loadLogs();
  await loadStats();
  await loadChart();
}

document.addEventListener("DOMContentLoaded", refreshAll);
