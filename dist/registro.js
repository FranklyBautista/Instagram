"use strict";
const form = document.querySelector(".form-registro");
const button = document.querySelector(".btn-registrar");
button.addEventListener("click", async () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nombreCompletoInput = document.getElementById('nombreCompleto');
    const usernameInput = document.getElementById('username');
    const email = emailInput.value;
    const password = passwordInput.value;
    const nombreCompleto = nombreCompletoInput.value; // Si lo vas a usar o guardar
    const username = usernameInput.value; // ¡La clave es la minúscula aquí!
    try {
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Asegúrate de que las claves aquí (email, password, username)
            // coincidan exactamente con lo que espera tu backend (Prisma)
            body: JSON.stringify({ email, password, username }),
        });
        const data = await res.json();
        console.log("Usuario registrado: ", data);
    }
    catch (error) {
        console.error("Error al registrar:", error);
    }
});
