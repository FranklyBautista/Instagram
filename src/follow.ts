import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// POST /follow
router.post("/", async (req, res) => {
  const { followerId, followingId } = req.body;

  if (followerId === followingId) {
    return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
  }

  try {
    const alreadyFollowing = await prisma.follower.findFirst({
      where: { followerId, followingId }
    });

    if (alreadyFollowing) {
      return res.status(400).json({ error: "Ya sigues a este usuario" });
    }

    await prisma.follower.create({
      data: { followerId, followingId }
    });

    res.status(200).json({ message: "Usuario seguido correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al seguir al usuario" });
  }
});

// DELETE /follow
router.delete("/", async (req, res) => {
  const { followerId, followingId } = req.body;

  try {
    await prisma.follower.deleteMany({
      where: { followerId, followingId }
    });

    res.status(200).json({ message: "Dejaste de seguir al usuario" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al dejar de seguir al usuario" });
  }
});

// GET /followers/:userId
router.get("/followers/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await prisma.follower.findMany({
      where: { followingId: parseInt(userId) },
      include: { follower: true },
    });

    res.json(followers.map(f => f.follower));
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo seguidores" });
  }
});

// GET /following/:userId
router.get("/following/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await prisma.follower.findMany({
      where: { followerId: parseInt(userId) },
      include: { following: true },
    });

    res.json(following.map(f => f.following));
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo seguidos" });
  }
});

export default router;
