import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import path from "path";

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

    res.status(200).json({ username: user.username });
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
        username: true,
        bio: true,
        avatarUrl: true,
        followers: true,
        following: true,
        posts: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Solo una vez app.listen
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

