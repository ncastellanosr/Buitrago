import { Router } from "express";
import { doObligation, doReminder } from "../controllers/obligationController";

const router = Router();

router.post("/new", doObligation);
router.post("/reminder", doReminder);

export default router;