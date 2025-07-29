"use strict";
const formulario = document.querySelector(".login-formulario");
const btn = document.querySelector(".btn-sesion");
btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const loginEmailInput = document.getElementById("email-login");
    const loginPasswordInput = document.getElementById("password-login");
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;
    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            console.log("Login exitoso:", data);
            // Redirigir al home o mostrar mensaje, guardar sesión, etc.
        }
        else {
            console.error("Error en login:", data.error);
            alert("Credenciales incorrectas");
        }
    }
    catch (error) {
        console.error("Error al intentar iniciar sesión:", error);
    }
});
