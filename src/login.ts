const formulario = document.querySelector(".login-formulario") as HTMLFormElement;
const btn = document.querySelector(".btn-sesion") as HTMLButtonElement;

btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const loginEmailInput = document.getElementById("email-login") as HTMLInputElement;
  const loginPasswordInput = document.getElementById("password-login") as HTMLInputElement;

  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json(); // ✅ Solo una vez

    if (res.ok) {
      console.log("Login exitoso:", data);
     const { username, id } = data;
  localStorage.setItem("username", username);
  localStorage.setItem("userId", id.toString());
  window.location.href = `profile.html?user=${username}`;
    } else {
      console.error("Error en login:", data.error);
      alert("Credenciales incorrectas");
    }
  } catch (error) {
    console.error("Error al intentar iniciar sesión:", error);
  }
});
