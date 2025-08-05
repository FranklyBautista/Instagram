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
const follow_1 = __importDefault(require("./follow"));
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
app.use("/follow", follow_1.default);
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
        console.log("Usuario autenticado:", user);
        res.status(200).json({ username: user.username, id: user.id });
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
                id: true,
                username: true,
                bio: true,
                avatarUrl: true,
                posts: true,
            },
        });
        if (!user)
            return res.status(404).json({ error: "Usuario no encontrado" });
        // Contar seguidores y seguidos
        const [followersCount, followingCount] = yield Promise.all([
            prisma.follower.count({ where: { followingId: user.id } }),
            prisma.follower.count({ where: { followerId: user.id } }),
        ]);
        res.json(Object.assign(Object.assign({}, user), { followers: followersCount, following: followingCount }));
    }
    catch (error) {
        console.error("Error al obtener perfil:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
}));
app.get("/users/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = req.query.q;
    if (!q || q.trim() === "")
        return res.json([]);
    try {
        const users = yield prisma.user.findMany({
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
    }
    catch (error) {
        console.error("Error en búsqueda:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
}));
// POST /posts
app.post("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, description, userId } = req.body;
    if (!content || !userId) {
        return res.status(400).json({ error: "Faltan datos" });
    }
    try {
        const newPost = yield prisma.post.create({
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
    }
    catch (error) {
        console.error("Error al crear post:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
}));
// GET /posts/:userId
app.get("/posts", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma.post.findMany({
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
    }
    catch (error) {
        console.error("Error al obtener posts:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
}));
// POST /stories
app.post("/stories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageUrl, userId } = req.body;
    if (!imageUrl || !userId) {
        return res.status(400).json({ error: "Faltan datos" });
    }
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas
    try {
        const story = yield prisma.story.create({
            data: {
                imageUrl,
                userId,
                expiresAt,
            },
        });
        res.status(201).json(story);
    }
    catch (error) {
        console.error("Error al crear historia:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
}));
// GET /stories
app.get("/stories", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date(Date.now());
    try {
        const stories = yield prisma.story.findMany({
            where: {
                expiresAt: {
                    gt: now,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
            take: 50,
        });
        res.json(stories);
    }
    catch (error) {
        console.error("Error al obtener historias:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
}));
// Solo una vez app.listen
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
