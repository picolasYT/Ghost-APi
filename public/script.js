/* =========================
   UTILIDAD GENERAL (DEBUG)
========================= */
async function callApi(endpoint) {
  const output = document.getElementById("output");
  if (!output) return;

  output.textContent = "⏳ Processing request...";

  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = "❌ Error al llamar a la API";
  }
}

/* =========================
   MODAL YOUTUBE
========================= */

function openYTModal() {
  const modal = document.getElementById("ytModal");
  modal.classList.remove("hidden");

  document.getElementById("ytUrl").value = "";
  document.getElementById("ytEndpoint").value = "";
  document.getElementById("ytStatus").textContent = "";
  document.getElementById("ytResponse").innerHTML = "";
}

function closeYTModal() {
  document.getElementById("ytModal").classList.add("hidden");
}

function copyYTEndpoint() {
  const input = document.getElementById("ytEndpoint");
  if (!input.value) return;

  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value);
}

/* =========================
   SUBMIT YOUTUBE (REAL)
========================= */
async function submitYT() {
  const urlInput = document.getElementById("ytUrl");
  const status = document.getElementById("ytStatus");
  const output = document.getElementById("ytResponse");
  const endpointInput = document.getElementById("ytEndpoint");

  const url = urlInput.value.trim();

  if (!url) {
    status.textContent = "⚠️ Pegá una URL primero";
    return;
  }

  // Endpoint público
  const endpoint =
    `https://ghost-api-wbqx.onrender.com/api/download/youtube?url=${encodeURIComponent(url)}`;

  endpointInput.value = endpoint;

  status.textContent = "⏳ Processing request...";
  output.innerHTML = "";

  try {
    const res = await fetch(`/api/download/youtube?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (!data || data.error) {
      status.textContent = "❌ Error";
      output.innerHTML = `
        <div style="color:#ffb4b4;">
          ${data?.error || "No se pudo procesar YouTube"}
        </div>
      `;
      return;
    }

    status.textContent = "✅ Success";

    output.innerHTML = `
      <p><strong>Título:</strong> ${data.title || "Sin título"}</p>
      <p><strong>Canal:</strong> ${data.channel || "Desconocido"}</p>
      <p style="font-size:13px;color:#bbb;">
        Duración: ${data.duration || "N/D"}
      </p>

      ${
        data.video
          ? `
        <video controls style="width:100%;border-radius:12px;margin-top:10px;">
          <source src="${data.video}" type="video/mp4">
        </video>

        <div style="margin-top:12px;">
          <a href="${data.video}" target="_blank">
            <button>📥 Download Video</button>
          </a>
        </div>
      `
          : `<p style="color:#ffb4b4;">No se encontró video descargable</p>`
      }
    `;
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error";
    output.textContent = "Error al procesar la solicitud";
  }
}

/* =========================
   SUBMIT YOUTUBE (REAL)
========================= */
async function submitYT() {
  const urlInput = document.getElementById("ytUrl");
  const status = document.getElementById("ytStatus");
  const output = document.getElementById("ytResponse");
  const endpointInput = document.getElementById("ytEndpoint");

  const url = urlInput.value.trim();

  if (!url) {
    status.textContent = "⚠️ Pegá una URL primero";
    return;
  }

  // Mostrar endpoint REAL
  endpointInput.value =
    `https://ghost-api-wbqx.onrender.com/api/download/youtube?url=${encodeURIComponent(url)}`;

  status.textContent = "⏳ Processing request...";
  output.innerHTML = "";

  try {
    const res = await fetch(
      `/api/download/youtube?url=${encodeURIComponent(url)}`
    );

    const data = await res.json();

    if (!data.ok || data.error) {
      status.textContent = "❌ Error";
      output.innerHTML = `
        <div style="color:#ffb4b4;">
          ${data.error || "No se pudo procesar YouTube"}
        </div>
      `;
      return;
    }

    status.textContent = "✅ Success";

    const videoUrl = data.video;

    output.innerHTML = `
      <p><strong>Título:</strong> ${data.title || "Sin título"}</p>
      <p><strong>Canal:</strong> ${data.channel || "Desconocido"}</p>
      <p style="font-size:13px;color:#bbb;">
        Duración: ${data.duration ? data.duration + "s" : "N/D"}
      </p>

      ${
        videoUrl
          ? `
      <video controls style="width:100%;border-radius:12px;margin-top:10px;">
        <source src="${videoUrl}" type="video/mp4">
        Tu navegador no soporta video.
      </video>

      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
        <a href="${videoUrl}" target="_blank">
          <button>📥 Download Video</button>
        </a>
      </div>
      `
          : `<p style="color:#ffb4b4;">No se encontró video descargable</p>`
      }

      ${
        Array.isArray(data.alternatives) && data.alternatives.length
          ? `
          <details style="margin-top:12px;">
            <summary>Otras calidades</summary>
            <ul>
              ${data.alternatives
                .map(
                  a =>
                    `<li>
                      ${a.quality || ""} –
                      <a href="${a.url}" target="_blank">descargar</a>
                    </li>`
                )
                .join("")}
            </ul>
          </details>
          `
          : ""
      }
    `;
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error";
    output.textContent = "Error al procesar la solicitud";
  }
}

/* =========================
   CERRAR MODALES CON ESC
========================= */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeYTModal();
    closeTTModal();
    closeIGModal();
  }
});

/* =========================
   MODAL TIKTOK
========================= */
function openTTModal() {
  const modal = document.getElementById("ttModal");
  if (!modal) return;

  modal.classList.remove("hidden");
  document.getElementById("ttStatus").textContent = "";
  document.getElementById("ttResponse").innerHTML = "";
  document.getElementById("ttUrl").value = "";
  document.getElementById("ttEndpoint").value = "";
}

function closeTTModal() {
  const modal = document.getElementById("ttModal");
  if (modal) modal.classList.add("hidden");
}

function copyTTEndpoint() {
  const input = document.getElementById("ttEndpoint");
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value);
}

/* =========================
   SUBMIT TIKTOK (REAL)
========================= */
async function submitTT() {
  const urlInput = document.getElementById("ttUrl");
  const status = document.getElementById("ttStatus");
  const output = document.getElementById("ttResponse");
  const endpointInput = document.getElementById("ttEndpoint");

  const url = urlInput.value.trim();

  if (!url) {
    status.textContent = "⚠️ Pegá una URL primero";
    return;
  }

  // Mostrar endpoint REAL (tu dominio)
  endpointInput.value =
    `https://ghost-api-wbqx.onrender.com/api/download/tiktok?url=${encodeURIComponent(url)}`;

  status.textContent = "⏳ Processing request...";
  output.innerHTML = "";

  try {
    const res = await fetch(
      `/api/download/tiktok?url=${encodeURIComponent(url)}`
    );

    const data = await res.json();

    if (data.error) {
      status.textContent = "❌ Error";
      output.innerHTML = `
        <div style="color:#ffb4b4;">
          ${data.error}
        </div>
      `;
      return;
    }

    status.textContent = "✅ Success";

    const videoUrl = data.video_no_watermark || data.video;

    output.innerHTML = `
      <p><strong>Autor:</strong> ${data.author || "Desconocido"}</p>

      <p style="font-size:13px;color:#bbb;">
        ${data.description || ""}
      </p>

      <video controls style="width:100%;border-radius:12px;margin-top:10px;">
        <source src="${videoUrl}" type="video/mp4">
        Tu navegador no soporta video.
      </video>

      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
        <a href="${videoUrl}" target="_blank">
          <button>📥 Download Video</button>
        </a>

        ${
          data.music
            ? `<a href="${data.music}" target="_blank">
                 <button>🎵 Download Music</button>
               </a>`
            : ""
        }
      </div>
    `;
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error";
    output.textContent = "Error al procesar la solicitud";
  }
}

/* =========================
   MODAL INSTAGRAM (MAINTENANCE)
========================= */
function openIGModal() {
  const modal = document.getElementById("igModal");
  modal.classList.remove("hidden");
  document.getElementById("igStatus").textContent = "";
  document.getElementById("igResponse").innerHTML = "";
  document.getElementById("igUrl").value = "";
}

function closeIGModal() {
  document.getElementById("igModal").classList.add("hidden");
}

async function submitIG() {
  const url = document.getElementById("igUrl").value.trim();
  const status = document.getElementById("igStatus");
  const output = document.getElementById("igResponse");

  if (!url) {
    status.textContent = "⚠️ Pegá una URL primero";
    return;
  }

  status.textContent = "⏳ Processing request...";
  output.innerHTML = "";

  try {
    const res = await fetch(
      `/api/download/instagram?url=${encodeURIComponent(url)}`
    );
    const data = await res.json();

    if (data.error) {
      status.textContent = "❌ Error";
      output.textContent = data.error;
      return;
    }

    status.textContent = "✅ Success";

    output.innerHTML = `
      <video controls style="width:100%;border-radius:12px;margin-top:10px;">
        <source src="${data.video}" type="video/mp4">
      </video>

      <div style="margin-top:12px">
        <a href="${data.video}" target="_blank">
          <button>📥 Download Video</button>
        </a>
      </div>
    `;
  } catch (e) {
    status.textContent = "❌ Error";
    output.textContent = "Error conectando con Instagram";
  }
}

function goRegister() {
  window.location.href = "/register.html"; // 👤 USUARIO
}

function goLogin() {
  window.location.href = "/login.html"; // 👤 USUARIO
}

function goAdmin() {
  window.location.href = "/admin/login.html"; // 🛠 ADMIN
}
