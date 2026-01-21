const API = "/api";

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        error.textContent = data.error;
        return;
      }
      localStorage.setItem("token", data.token);
      location.href = "dashboard.html";
    });
}

const token = localStorage.getItem("token");
if (!token && location.pathname.includes("dashboard")) {
  location.href = "login.html";
}

function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}

function authFetch(url) {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json());
}

if (location.pathname.includes("dashboard")) {
  authFetch("/api/admin/stats")
    .then(data => {
      document.getElementById("stats").textContent =
        JSON.stringify(data, null, 2);
    });

  authFetch("/api/admin/users")
    .then(data => {
      document.getElementById("users").textContent =
        JSON.stringify(data, null, 2);
    });

  authFetch("/api/admin/logs")
    .then(data => {
      document.getElementById("logs").textContent =
        JSON.stringify(data, null, 2);
    });
}
