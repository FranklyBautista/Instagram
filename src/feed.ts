document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".main-section");

  try {
    const res = await fetch("http://localhost:3000/posts");
    const posts = await res.json();

    posts.forEach((post: any) => {
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
      container?.insertAdjacentHTML("beforeend", postHtml);
    });
  } catch (error) {
    console.error("Error al cargar el feed:", error);
  }

 const form = document.getElementById("new-post-form") as HTMLFormElement;
const contentInput = document.getElementById("post-content") as HTMLInputElement;
const descriptionInput = document.getElementById("post-description") as HTMLTextAreaElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = contentInput.value.trim();
  const description = descriptionInput.value.trim();
  const userId = localStorage.getItem("userId");

  if (!content || !userId) return;

  try {
    const res = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, description, userId: parseInt(userId) }),
    });

    if (res.ok) {
      contentInput.value = "";
      descriptionInput.value = "";
      location.reload(); // recarga el feed
    }
  } catch (error) {
    console.error("Error al publicar:", error);
  }
});

});

