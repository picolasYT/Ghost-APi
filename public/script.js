async function callApi(endpoint) {
  const res = await fetch(endpoint);
  const data = await res.json();
  document.getElementById("output").textContent =
    JSON.stringify(data, null, 2);
}
