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
   MODAL YOUTUBE (MAINTENANCE)
========================= */
function openYTModal() {
  const modal = document.getElementById("ytModal");
  if (!modal) return;

  modal.classList.remove("hidden");
  document.getElementById("ytStatus").textContent = "🚧 En mantenimiento";
  document.getElementById("ytResponse").textContent =
    "YouTube downloader está temporalmente deshabilitado.";
  document.getElementById("ytUrl").value = "";
}

function closeYTModal() {
  const modal = document.getElementById("ytModal");
  if (!modal) return;

  modal.classList.add("hidden");
}

/* =========================
   SUBMIT YOUTUBE (SOLO INFO)
========================= */
async function submitYT() {
  const status = document.getElementById("ytStatus");
  const output = document.getElementById("ytResponse");

  status.textContent = "🚧 YouTube está en mantenimiento";
  output.textContent =
    "Este endpoint está deshabilitado temporalmente. Usá TikTok.";
}

/* =========================
   CERRAR MODALES CON ESC
========================= */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeYTModal();
    closeTTModal();
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
}

function closeTTModal() {
  const modal = document.getElementById("ttModal");
  if (!modal) return;

  modal.classList.add("hidden");
}

/* =========================
   SUBMIT TIKTOK (REAL)
========================= */
async function submitTT() {
  const urlInput = document.getElementById("ttUrl");
  const status = document.getElementById("ttStatus");
  const output = document.getElementById("ttResponse");

  const url = urlInput.value.trim();

  if (!url) {
    status.textContent = "⚠️ Pegá una URL primero";
    return;
  }

  status.textContent = "⏳ Processing request...";
  output.innerHTML = "";

  try {
    const res = await fetch(
      `/api/download/tiktok?url=${encodeURIComponent(url)}`
    );

    const data = await res.json();

    if (data.error) {
      status.textContent = "❌ Error";
      output.textContent = JSON.stringify(data, null, 2);
      return;
    }

    status.textContent = "✅ Success";

    output.innerHTML = `
      <p><strong>Autor:</strong> ${data.author || "Desconocido"}</p>
      <p style="font-size:13px;color:#bbb;">
        ${data.description || ""}
      </p>

      <video controls style="width:100%;border-radius:12px;margin-top:10px;">
        <source src="${data.video_no_watermark}" type="video/mp4">
        Tu navegador no soporta video.
      </video>

      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
        <a href="${data.video_no_watermark}" target="_blank">
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
