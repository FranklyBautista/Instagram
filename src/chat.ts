document.addEventListener("DOMContentLoaded", async () => {
  const messagesContainer = document.getElementById("messages") as HTMLElement;
  const form = document.getElementById("message-form") as HTMLFormElement;
  const input = document.getElementById("message-input") as HTMLInputElement;
  const chatWithHeader = document.getElementById("chat-with") as HTMLElement;

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
  async function cargarMensajes() {
    try {
      const res = await fetch(`http://localhost:3000/messages?from=${currentUserId}&to=${otherUserId}`);
      const data = await res.json();

      messagesContainer.innerHTML = "";
      data.forEach((msg: any) => {
        const div = document.createElement("div");
        div.classList.add("message");
        div.classList.add(msg.senderId == currentUserId ? "self" : "other");
        div.textContent = msg.content;
        messagesContainer.appendChild(div);
      });

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
      console.error("Error cargando mensajes:", error);
    }
  }

  await cargarMensajes();

  // Enviar nuevo mensaje
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = input.value.trim();
    if (!content) return;

    try {
      await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: parseInt(currentUserId),
          receiverId: parseInt(otherUserId),
          content,
        }),
      });

      input.value = "";
      await cargarMensajes(); // Recargar los mensajes después de enviar
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  });

  // Opcional: mostrar con quién se chatea (si quieres mostrar el nombre)
  try {
    const res = await fetch(`http://localhost:3000/user/${otherUserId}`);
    const otherUser = await res.json();
    chatWithHeader.textContent = `Chat con ${otherUser.username}`;
  } catch (err) {
    chatWithHeader.textContent = "Chat";
  }
});
