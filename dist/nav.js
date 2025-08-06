"use strict";
document.addEventListener("DOMContentLoaded", () => {
    // 1) Asegurar sesión en páginas privadas
    const isPublic = location.pathname.endsWith("/login.html") || location.pathname.endsWith("/register.html");
    const userId = localStorage.getItem("userId");
    if (!isPublic && !userId) {
        window.location.href = "/login.html";
        return;
    }
    // 2) Resaltar ítem activo
    const path = location.pathname.toLowerCase();
    const map = {
        "#nav-home": ["/", "/index.html"],
        "#nav-search": ["/search.html"],
        "#nav-explore": ["/index.html#explore"],
        "#nav-reels": ["/reels.html"],
        "#nav-messages": ["/messages.html"],
        "#nav-notifications": ["/notifications.html"],
        "#nav-create": ["/index.html#new-post-section"],
        "#nav-profile": ["/profile.html"],
    };
    for (const [id, routes] of Object.entries(map)) {
        const link = document.querySelector(id);
        if (!link)
            continue;
        const isActive = routes.some(r => r === path) ||
            (id === "#nav-create" && location.hash === "#new-post-section") ||
            (id === "#nav-explore" && location.hash === "#explore");
        if (isActive)
            link.classList.add("active");
    }
    // 3) (Opcional) Si quieres que "Perfil" siempre apunte a TU perfil (aunque cambie la app)
    const profileLink = document.querySelector("#nav-profile");
    if (profileLink) {
        profileLink.href = "/profile.html";
    }
});
