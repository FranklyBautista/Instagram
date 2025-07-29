"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Permite recibir JSON en los body requests
app.post("/register", async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: { email, password, username },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error al registrar usuario:", error); // Añade o asegura esta línea
        res.status(500).json({ error: "No se pudo registrar el usuario" });
    }
});
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }
        res.status(200).json({ message: "Login exitoso", user });
    }
    catch (error) {
        res.status(500).json({ error: "Error al iniciar sesion" });
    }
});
app.get("/profile/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                username: true,
                bio: true, // ✅ Ya deberías poder acceder a esto
            },
        });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(user);
    }
    catch (error) {
        console.error("Error al obtener perfil:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});
