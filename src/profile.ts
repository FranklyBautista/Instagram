document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");

  if (!username) {
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
    } else {
      alert("No se pudo cargar el perfil");
    }
  } catch (error) {
    console.error("Error cargando perfil:", error);
  }
});
