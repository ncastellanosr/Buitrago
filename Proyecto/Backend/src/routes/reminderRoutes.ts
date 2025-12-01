import { Router } from "express";
import { createReminder, getReminders } from "../controllers/reminderController";

const router = Router();

router.post("/new", createReminder);
router.post("/get", getReminders);

export default router;