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
    const container = document.querySelector(".main-section");
    try {
        const res = yield fetch("http://localhost:3000/posts");
        const posts = yield res.json();
        posts.forEach((post) => {
            const postHtml = `
        <div class="post-container">
          <div class="post-header">
            <div class="main-post-header">
              <img src="${post.user.avatarUrl || "https://logodix.com/logo/1984127.png"}" alt="">
              <span class="user-name">${post.user.username}</span>
            </div>
            <span class="post-options">...</span>
          </div>
          <div class="post-img-container">
            <img src="${post.content}" alt="">
          </div>
          <div class="post-reactions">
            <div class="reactions">
              <span class="like material-symbols-outlined">favorite</span>
              <span class="comment material-symbols-outlined">chat_bubble</span>
              <span class="send material-symbols-outlined">arrow_outward</span>
            </div>
            <span class="save material-symbols-outlined">archive</span>
          </div>
          <div class="num-likes"><span>0</span> Me gusta</div>
          <div class="text-container">
            <p class="text-content" id="post-description">
            ${post.description || "Sin descripción"}
            </p>

          </div>
          <div class="post-divider"></div>
        </div>
      `;
            container === null || container === void 0 ? void 0 : container.insertAdjacentHTML("beforeend", postHtml);
        });
    }
    catch (error) {
        console.error("Error al cargar el feed:", error);
    }
    const form = document.getElementById("new-post-form");
    const contentInput = document.getElementById("post-content");
    const descriptionInput = document.getElementById("post-description");
    form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const content = contentInput.value.trim();
        const description = descriptionInput.value.trim();
        const userId = localStorage.getItem("userId");
        if (!content || !userId)
            return;
        try {
            const res = yield fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, description, userId: parseInt(userId) }),
            });
            if (res.ok) {
                contentInput.value = "";
                descriptionInput.value = "";
                location.reload(); // recarga el feed
            }
        }
        catch (error) {
            console.error("Error al publicar:", error);
        }
    }));
}));
