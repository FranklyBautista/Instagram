import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import cors from "cors";
import path from "path";
import followRoutes from "./follow"

const prisma = new PrismaClient();
const app = express();
const port = 3000;

// Middleware necesario para leer JSON
app.use(cors());
app.use(express.json());

// Rutas estáticas
app.use(express.static(path.join(__dirname, "../html")));
app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use("/styles", express.static(path.join(__dirname, "../styles")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/follow", followRoutes)

// POST /register
app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { email, password, username },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "No se pudo registrar el usuario" });
  }
});

// POST /login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    console.log("Usuario autenticado:", user);
    res.status(200).json({ username: user.username, id: user.id });

  } catch (error) {
    console.error("Error al hacer login:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// GET /profile/:username
app.get("/profile/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        posts: true,
      },
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Contar seguidores y seguidos
    const [followersCount, followingCount] = await Promise.all([
      prisma.follower.count({ where: { followingId: user.id } }),
      prisma.follower.count({ where: { followerId: user.id } }),
    ]);

    res.json({
      ...user,
      followers: followersCount,
      following: followingCount,
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});


app.get("/users/search", async (req, res) => {
  const q = req.query.q as string;

  if (!q || q.trim() === "") return res.json([]);

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: q,
        },
      },
      select: {
        id: true,
        username: true,
      },
      take: 10,
    });

    res.json(users);
  } catch (error) {
    console.error("Error en búsqueda:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// POST /posts
app.post("/posts", async (req, res) => {
  const { content, description, userId } = req.body;

  if (!content || !userId) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        description,
        userId,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error al crear post:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});



// GET /posts/:userId
app.get("/posts", async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.json(posts);
  } catch (error) {
    console.error("Error al obtener posts:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});





// Solo una vez app.listen
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

