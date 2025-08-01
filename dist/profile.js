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
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const username = localStorage.getItem("username");
    if (!username) {
        alert("Usuario no autenticado");
        window.location.href = "/login.html";
        return;
    }
    try {
        const res = yield fetch(`http://localhost:3000/profile/${username}`);
        const data = yield res.json();
        if (res.ok) {
            document.getElementById("username").textContent = data.username;
            document.querySelector(".bio").textContent = data.bio || "Sin bio";
            document.querySelector(".profile-picture").setAttribute("src", data.avatarUrl || "../assets/avatarDefault.jpg");
            document.querySelector(".posts").textContent = `${data.posts} publicaciones`;
            document.querySelector(".followers").textContent = `${data.followers} seguidores`;
            document.querySelector(".following").textContent = `${data.following} seguidos`;
        }
        else {
            alert("No se pudo cargar el perfil");
        }
    }
    catch (error) {
        console.error("Error cargando perfil:", error);
    }
}));
