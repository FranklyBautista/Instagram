document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  if (!username || !userId) {
    alert("Usuario no autenticado");
    window.location.href = "/login.html";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/profile/${username}`);
    const data = await res.json();

    if (res.ok) {
      document.getElementById("username")!.textContent = data.username;
      document.querySelector(".bio")!.textContent = data.bio || "Sin bio";
      document.querySelector(".profile-picture")!.setAttribute("src", data.avatarUrl || "../assets/avatarDefault.jpg");

      document.querySelector(".posts")!.textContent = `${data.posts} publicaciones`;
      document.querySelector(".followers")!.textContent = `${data.followers} seguidores`;
      document.querySelector(".following")!.textContent = `${data.following} seguidos`;

      // Mostrar formulario al hacer clic en "Editar perfil"
      const editBtn = document.querySelector(".sup button") as HTMLButtonElement;
      editBtn.addEventListener("click", () => {
        const form = document.getElementById("edit-profile-form")!;
        form.style.display = form.style.display === "none" ? "block" : "none";

        // Precargar valores actuales
        (document.getElementById("edit-username") as HTMLInputElement).value = data.username;
        (document.getElementById("edit-avatar") as HTMLInputElement).value = data.avatarUrl || "";
        (document.getElementById("edit-bio") as HTMLTextAreaElement).value = data.bio || "";
      });

    } else {
      alert("No se pudo cargar el perfil");
    }

    // Obtener publicaciones personales
    const postsRes = await fetch(`http://localhost:3000/users/${username}/posts`);
    const posts = await postsRes.json();
    const postSection = document.querySelector(".user-posts-grid");

    posts.forEach((post: any) => {
      const postHtml = `
        <div class="post-container">
          <div class="post-img-container">
            <img src="${post.content}" alt="Publicación del usuario">
          </div>
        </div>
      `;
      postSection?.insertAdjacentHTML("beforeend", postHtml);
    });

  } catch (error) {
    console.error("Error cargando perfil o publicaciones:", error);
  }

  // Manejo del formulario
  const editForm = document.getElementById("edit-profile-form") as HTMLFormElement;
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newUsername = (document.getElementById("edit-username") as HTMLInputElement).value.trim();
    const newBio = (document.getElementById("edit-bio") as HTMLTextAreaElement).value.trim();
    const newAvatar = (document.getElementById("edit-avatar") as HTMLInputElement).value.trim();

    try {
      const res = await fetch(`http://localhost:3000/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, bio: newBio, avatarUrl: newAvatar }),
      });

      if (res.ok) {
        localStorage.setItem("username", newUsername);
        alert("Perfil actualizado correctamente");
        location.reload();
      } else {
        alert("Error al actualizar perfil");
      }
    } catch (error) {
      console.error("Error en actualización:", error);
    }
  });
});

