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
