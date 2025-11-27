import { Router } from "express";
import { doObligation, doReminder } from "../controllers/obligationController";

const router = Router();

router.post("/make_obligation", doObligation);
router.post("/make_reminder", doReminder);

export default router;