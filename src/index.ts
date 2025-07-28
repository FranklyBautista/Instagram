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
