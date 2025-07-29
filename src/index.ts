import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); // Permite recibir JSON en los body requests

app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { email, password, username },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al registrar usuario:", error); // Añade o asegura esta línea
    res.status(500).json({ error: "No se pudo registrar el usuario" });
}
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

app.post("/login", async (req, res) =>{
  const {email,password} = req.body;

  try{
    const user = await prisma.user.findUnique({where: {email}})

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    res.status(200).json({ message: "Login exitoso", user });
  }catch(error){
    res.status(500).json({error:"Error al iniciar sesion"})
  }
})


app.get("/profile/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        username:true,
        bio: true,
        avatarUrl: true,
        followers:true,
        following:true,
        posts:true

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
