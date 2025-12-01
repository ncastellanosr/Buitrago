import { Router } from "express";
import { createReminder } from "../controllers/reminderController";

const router = Router();

router.post("/new", createReminder);

export default router;