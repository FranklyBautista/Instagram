"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const formulario = document.querySelector(".login-formulario");
const btn = document.querySelector(".btn-sesion");
btn.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const loginEmailInput = document.getElementById("email-login");
    const loginPasswordInput = document.getElementById("password-login");
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;
    try {
        const res = yield fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = yield res.json(); // ✅ Solo una vez
        if (res.ok) {
            console.log("Login exitoso:", data);
            const { username, id } = data;
            localStorage.setItem("username", username);
            localStorage.setItem("userId", id.toString());
            window.location.href = `profile.html?user=${username}`;
        }
        else {
            console.error("Error en login:", data.error);
            alert("Credenciales incorrectas");
        }
    }
    catch (error) {
        console.error("Error al intentar iniciar sesión:", error);
    }
}));
