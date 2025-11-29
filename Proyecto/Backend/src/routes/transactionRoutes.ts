import { Router } from "express";
import { doTransaction } from "../controllers/transactionController";

const router = Router();

router.post("/new", doTransaction);

export default router;
