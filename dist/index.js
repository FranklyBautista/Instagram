"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = 3000;
// Middleware necesario para leer JSON
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas estáticas
app.use(express_1.default.static(path_1.default.join(__dirname, "../html")));
app.use("/dist", express_1.default.static(path_1.default.join(__dirname, "../dist")));
app.use("/styles", express_1.default.static(path_1.default.join(__dirname, "../styles")));
app.use("/assets", express_1.default.static(path_1.default.join(__dirname, "../assets")));
// POST /register
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    try {
        const newUser = yield prisma.user.create({
            data: { email, password, username },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: "No se pudo registrar el usuario" });
    }
}));
// POST /login
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }
        res.status(200).json({ username: user.username });
    }
    catch (error) {
        console.error("Error al hacer login:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
}));
// GET /profile/:username
app.get("/profile/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const user = yield prisma.user.findUnique({
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
    }
    catch (error) {
        console.error("Error al obtener perfil:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
}));
// Solo una vez app.listen
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
