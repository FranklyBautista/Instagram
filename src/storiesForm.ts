document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("story-form") as HTMLFormElement;
  const imageUrlInput = document.getElementById("story-image-url") as HTMLInputElement;
  const successMessage = document.getElementById("success-message") as HTMLElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const imageUrl = imageUrlInput.value.trim();
    const userId = localStorage.getItem("userId");

    if (!imageUrl || !userId) {
      alert("Faltan datos");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/stories", {
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
      } else {
        alert("Error al publicar la historia");
      }
    } catch (error) {
      console.error("Error al enviar historia:", error);
    }
  });
});
