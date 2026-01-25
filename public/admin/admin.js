async function loadLogs() {
  const res = await fetch("/api/admin/logs");
  const data = await res.json();

  document.getElementById("total").textContent = data.length;

  const list = document.getElementById("logList");
  list.innerHTML = "";

  data.forEach(log => {
    const div = document.createElement("div");
    div.className = "log";

    div.innerHTML = `
      <div class="flag">🇦🇷</div>
      <div class="info">
        <strong>${log.method}</strong> ${log.path}<br/>
        <small>${log.ip} • ${log.ua}</small>
      </div>
      <div class="time">${new Date(log.time).toLocaleTimeString()}</div>
    `;

    list.appendChild(div);
  });
}

loadLogs();
