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
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search-input");
    const results = document.getElementById("results");
    const currentUserId = localStorage.getItem("userId"); // ⬅️ aquí usamos el ID
    const currentUsername = localStorage.getItem("username");
    input.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
        const query = input.value.trim();
        if (!query) {
            results.innerHTML = "";
            return;
        }
        try {
            const res = yield fetch(`http://localhost:3000/users/search?q=${query}`);
            const users = yield res.json();
            results.innerHTML = "";
            users.forEach((user) => {
                if (user.username === currentUsername)
                    return;
                const li = document.createElement("li");
                li.textContent = user.username;
                const followBtn = document.createElement("button");
                followBtn.textContent = "Seguir";
                followBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                    try {
                        const followRes = yield fetch("http://localhost:3000/follow", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                followerId: parseInt(currentUserId || "0"), // ✅ ID actual
                                followingId: user.id, // ✅ ID del otro usuario
                            }),
                        });
                        const data = yield followRes.json();
                        if (followRes.ok) {
                            alert(`Ahora sigues a ${user.username}`);
                        }
                        else {
                            alert(data.error || "Error al seguir");
                        }
                    }
                    catch (err) {
                        console.error("Error al seguir usuario:", err);
                    }
                }));
                li.appendChild(followBtn);
                results.appendChild(li);
            });
        }
        catch (err) {
            console.error("Error al buscar:", err);
        }
    }));
});
