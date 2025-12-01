import { Router } from "express";
import { doObligation, doReminder, getObligations, obligationCount } from "../controllers/obligationController";

const router = Router();

router.post("/new", doObligation);
router.post("/reminder", doReminder);
router.post("/count", obligationCount);
router.post("/get", getObligations);

export default router;