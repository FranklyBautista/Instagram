document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input") as HTMLInputElement;
  const results = document.getElementById("results") as HTMLUListElement;
  const currentUserId = localStorage.getItem("userId"); // ⬅️ aquí usamos el ID
  const currentUsername = localStorage.getItem("username");

  input.addEventListener("input", async () => {
    const query = input.value.trim();
    if (!query) {
      results.innerHTML = "";
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/users/search?q=${query}`);
      const users = await res.json();

      results.innerHTML = "";
      users.forEach((user: any) => {
        if (user.username === currentUsername) return;

        const li = document.createElement("li");
        li.textContent = user.username;

        const followBtn = document.createElement("button");
        followBtn.textContent = "Seguir";
        followBtn.addEventListener("click", async () => {
          try {
            const followRes = await fetch("http://localhost:3000/follow", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                followerId: parseInt(currentUserId || "0"),     // ✅ ID actual
                followingId: user.id,                           // ✅ ID del otro usuario
              }),
            });

            const data = await followRes.json();
            if (followRes.ok) {
              alert(`Ahora sigues a ${user.username}`);
            } else {
              alert(data.error || "Error al seguir");
            }
          } catch (err) {
            console.error("Error al seguir usuario:", err);
          }
        });

        li.appendChild(followBtn);
        results.appendChild(li);
      });
    } catch (err) {
      console.error("Error al buscar:", err);
    }
  });
});

