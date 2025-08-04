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
    const messagesContainer = document.getElementById("messages");
    const form = document.getElementById("message-form");
    const input = document.getElementById("message-input");
    const chatWithHeader = document.getElementById("chat-with");
    const currentUserId = localStorage.getItem("userId");
    const currentUsername = localStorage.getItem("username");
    // Obtener el ID del usuario con el que se está chateando (desde la URL)
    const params = new URLSearchParams(window.location.search);
    const otherUserId = params.get("with");
    if (!currentUserId || !otherUserId) {
        alert("Faltan datos del usuario o destinatario");
        return;
    }
    // Obtener y mostrar los mensajes anteriores
    function cargarMensajes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`http://localhost:3000/messages?from=${currentUserId}&to=${otherUserId}`);
                const data = yield res.json();
                messagesContainer.innerHTML = "";
                data.forEach((msg) => {
                    const div = document.createElement("div");
                    div.classList.add("message");
                    div.classList.add(msg.senderId == currentUserId ? "self" : "other");
                    div.textContent = msg.content;
                    messagesContainer.appendChild(div);
                });
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            catch (error) {
                console.error("Error cargando mensajes:", error);
            }
        });
    }
    yield cargarMensajes();
    // Enviar nuevo mensaje
    form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const content = input.value.trim();
        if (!content)
            return;
        try {
            yield fetch("http://localhost:3000/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: parseInt(currentUserId),
                    receiverId: parseInt(otherUserId),
                    content,
                }),
            });
            input.value = "";
            yield cargarMensajes(); // Recargar los mensajes después de enviar
        }
        catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    }));
    // Opcional: mostrar con quién se chatea (si quieres mostrar el nombre)
    try {
        const res = yield fetch(`http://localhost:3000/user/${otherUserId}`);
        const otherUser = yield res.json();
        chatWithHeader.textContent = `Chat con ${otherUser.username}`;
    }
    catch (err) {
        chatWithHeader.textContent = "Chat";
    }
}));
