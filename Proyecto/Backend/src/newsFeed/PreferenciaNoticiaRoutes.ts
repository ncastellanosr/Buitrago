import express, { Request, Response } from "express";
import { AppDataSource } from "../database";
import { PreferenciaNoticia } from "../entities/PreferenciaNoticia";
import { authenticateToken, AuthRequest } from "../authMiddleware";

const router = express.Router();

async function getRepo() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource.getRepository(PreferenciaNoticia);
}

router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const repo = await getRepo();
    const userId = req.user.userId;

    const prefs = await repo.find({
      where: { user: { id: userId } as any },
    });

    return res.json(prefs);
  } catch (err) {
    console.error("Error obteniendo preferencias:", err);
    return res.status(500).json({ mensaje: "error interno" });
  }
});
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { category, priority } = req.body || {};
    const userId = req.user.userId;

    if (!category) {
      return res.status(400).json({ mensaje: "category es requerida" });
    }

    const repo = await getRepo();

    let pref = await repo.findOne({
      where: {
        user: { id: userId } as any,
        category,
      },
      relations: ["user"],
    });

    if (!pref) {
      pref = repo.create({
        user: { id: userId } as any,
        category,
        priority: priority !== undefined ? !!priority : true,
      });
    } else {
      if (priority !== undefined) {
        pref.priority = !!priority;
      }
    }

    const saved = await repo.save(pref);
    return res.json({ saved: true, preferencia: saved });
  } catch (err) {
    console.error("Error guardando preferencia:", err);
    return res.status(500).json({ mensaje: "error interno" });
  }
});

export default router;
