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
const form = document.querySelector(".form-registro");
const button = document.querySelector(".btn-registrar");
button.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nombreCompletoInput = document.getElementById('nombreCompleto');
    const usernameInput = document.getElementById('username');
    const email = emailInput.value;
    const password = passwordInput.value;
    const nombreCompleto = nombreCompletoInput.value; // Si lo vas a usar o guardar
    const username = usernameInput.value; // ¡La clave es la minúscula aquí!
    try {
        const res = yield fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Asegúrate de que las claves aquí (email, password, username)
            // coincidan exactamente con lo que espera tu backend (Prisma)
            body: JSON.stringify({ email, password, username }),
        });
        const data = yield res.json();
        console.log("Usuario registrado: ", data);
    }
    catch (error) {
        console.error("Error al registrar:", error);
    }
}));
