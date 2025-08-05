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
    var _a, _b;
    const carousel = document.getElementById("story-carousel");
    try {
        const res = yield fetch("http://localhost:3000/stories");
        const stories = yield res.json();
        stories.forEach((story) => {
            const storyHTML = `
        <div class="story" data-image="${story.imageUrl}" data-username="${story.user.username}">
          <div class="story-image-container">
            <img src="${story.imageUrl}" alt="historia" class="story-image">
          </div>
          <div class="story-username">${story.user.username}</div>
        </div>
      `;
            carousel === null || carousel === void 0 ? void 0 : carousel.insertAdjacentHTML("beforeend", storyHTML);
        });
        // Activar evento de clic para abrir modal
        document.querySelectorAll(".story").forEach((storyElement) => {
            storyElement.addEventListener("click", () => {
                const image = storyElement.getAttribute("data-image");
                const username = storyElement.getAttribute("data-username");
                const modal = document.getElementById("story-modal");
                const modalImg = document.getElementById("modal-story-image");
                const modalUsername = document.getElementById("modal-story-username");
                modalImg.src = image;
                modalUsername.textContent = `@${username}`;
                modal.classList.remove("hidden");
            });
        });
        // Botón de cerrar modal
        (_a = document.getElementById("close-modal")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            var _a;
            (_a = document.getElementById("story-modal")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        });
        // Cerrar al hacer clic fuera del contenido
        (_b = document.getElementById("story-modal")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => {
            var _a;
            if (e.target.id === "story-modal") {
                (_a = document.getElementById("story-modal")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
            }
        });
    }
    catch (error) {
        console.error("Error al cargar historias:", error);
    }
}));
