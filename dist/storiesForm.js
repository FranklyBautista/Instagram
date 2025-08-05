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
    const form = document.getElementById("story-form");
    const imageUrlInput = document.getElementById("story-image-url");
    const successMessage = document.getElementById("success-message");
    form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const imageUrl = imageUrlInput.value.trim();
        const userId = localStorage.getItem("userId");
        if (!imageUrl || !userId) {
            alert("Faltan datos");
            return;
        }
        try {
            const res = yield fetch("http://localhost:3000/stories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    imageUrl
                })
            });
            if (res.ok) {
                successMessage.style.display = "block";
                imageUrlInput.value = "";
            }
            else {
                alert("Error al publicar la historia");
            }
        }
        catch (error) {
            console.error("Error al enviar historia:", error);
        }
    }));
});
