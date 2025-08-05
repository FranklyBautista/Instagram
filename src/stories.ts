document.addEventListener("DOMContentLoaded", async () => {
  const carousel = document.getElementById("story-carousel");

  try {
    const res = await fetch("http://localhost:3000/stories");
    const stories = await res.json();

    stories.forEach((story: any) => {
      const storyHTML = `
        <div class="story" data-image="${story.imageUrl}" data-username="${story.user.username}">
          <div class="story-image-container">
            <img src="${story.imageUrl}" alt="historia" class="story-image">
          </div>
          <div class="story-username">${story.user.username}</div>
        </div>
      `;
      carousel?.insertAdjacentHTML("beforeend", storyHTML);
    });

    // Activar evento de clic para abrir modal
    document.querySelectorAll(".story").forEach((storyElement) => {
      storyElement.addEventListener("click", () => {
        const image = storyElement.getAttribute("data-image");
        const username = storyElement.getAttribute("data-username");

        const modal = document.getElementById("story-modal")!;
        const modalImg = document.getElementById("modal-story-image") as HTMLImageElement;
        const modalUsername = document.getElementById("modal-story-username")!;

        modalImg.src = image!;
        modalUsername.textContent = `@${username}`;
        modal.classList.remove("hidden");
      });
    });

    // Botón de cerrar modal
    document.getElementById("close-modal")?.addEventListener("click", () => {
      document.getElementById("story-modal")?.classList.add("hidden");
    });

    // Cerrar al hacer clic fuera del contenido
    document.getElementById("story-modal")?.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "story-modal") {
        document.getElementById("story-modal")?.classList.add("hidden");
      }
    });
    
  } catch (error) {
    console.error("Error al cargar historias:", error);
  }
});


