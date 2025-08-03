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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// POST /follow
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { followerId, followingId } = req.body;
    if (followerId === followingId) {
        return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
    }
    try {
        const alreadyFollowing = yield prisma.follower.findFirst({
            where: { followerId, followingId }
        });
        if (alreadyFollowing) {
            return res.status(400).json({ error: "Ya sigues a este usuario" });
        }
        yield prisma.follower.create({
            data: { followerId, followingId }
        });
        res.status(200).json({ message: "Usuario seguido correctamente" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al seguir al usuario" });
    }
}));
// DELETE /follow
router.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { followerId, followingId } = req.body;
    try {
        yield prisma.follower.deleteMany({
            where: { followerId, followingId }
        });
        res.status(200).json({ message: "Dejaste de seguir al usuario" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al dejar de seguir al usuario" });
    }
}));
// GET /followers/:userId
router.get("/followers/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const followers = yield prisma.follower.findMany({
            where: { followingId: parseInt(userId) },
            include: { follower: true },
        });
        res.json(followers.map(f => f.follower));
    }
    catch (error) {
        res.status(500).json({ error: "Error obteniendo seguidores" });
    }
}));
// GET /following/:userId
router.get("/following/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const following = yield prisma.follower.findMany({
            where: { followerId: parseInt(userId) },
            include: { following: true },
        });
        res.json(following.map(f => f.following));
    }
    catch (error) {
        res.status(500).json({ error: "Error obteniendo seguidos" });
    }
}));
exports.default = router;
