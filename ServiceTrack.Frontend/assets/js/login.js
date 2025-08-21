const API_URL = "http://localhost:5176/api/auth/login"; // ⚡ cambia si usas otro puerto

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, passwordHash: password })
    });

    if (!response.ok) {
      throw new Error("Credenciales inválidas");
    }

    const data = await response.json();

    // 🔑 Guardamos el token
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", email);

    // Redirigir al dashboard
    window.location.href = "index.html";

  } catch (err) {
    document.getElementById("loginMessage").innerText = err.message;
  }
});
