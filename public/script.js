/* =========================
   UTILIDAD GENERAL (DEBUG)
========================= */
async function callApi(endpoint) {
  const output = document.getElementById("output");
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
  document.getElementById("ytModal").classList.remove("hidden");
  document.getElementById("ytStatus").textContent = "";
  document.getElementById("ytResponse").textContent = "";
  document.getElementById("ytUrl").value = "";
}

function closeYTModal() {
  document.getElementById("ytModal").classList.add("hidden");
}

/* =========================
   SUBMIT YOUTUBE
========================= */
async function submitYT() {
  const urlInput = document.getElementById("ytUrl");
  const status = document.getElementById("ytStatus");
  const output = document.getElementById("ytResponse");

  const url = urlInput.value.trim();

  if (!url) {
    status.textContent = "⚠️ Pegá una URL primero";
    return;
  }

  status.textContent = "⏳ Processing request...";
  output.textContent = "";

  try {
    const res = await fetch(
      `/api/download/youtube?url=${encodeURIComponent(url)}`
    );

    const data = await res.json();

    if (data.error) {
      status.textContent = "❌ Error";
      output.textContent = JSON.stringify(data, null, 2);
      return;
    }

    status.textContent = "✅ Success";
    output.textContent = JSON.stringify(data, null, 2);

    // Si querés auto abrir descarga cuando sea real:
    // if (data.download) {
    //   window.open(data.download, "_blank");
    // }

  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error";
    output.textContent = "Error al procesar la solicitud";
  }
}

/* =========================
   CERRAR MODAL CON ESC
========================= */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeYTModal();
  }
});

/* =========================
   MODAL TIKTOK
========================= */
function openTTModal() {
  document.getElementById("ttModal").classList.remove("hidden");
  document.getElementById("ttStatus").textContent = "";
  document.getElementById("ttResponse").textContent = "";
  document.getElementById("ttUrl").value = "";
}

function closeTTModal() {
  document.getElementById("ttModal").classList.add("hidden");
}

/* =========================
   SUBMIT TIKTOK
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
  output.textContent = "";

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
    output.textContent = JSON.stringify(data, null, 2);

    // AUTO ABRIR DESCARGA (opcional)
    // if (data.video_no_watermark) {
    //   window.open(data.video_no_watermark, "_blank");
    // }

  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error";
    output.textContent = "Error al procesar la solicitud";
  }
}
