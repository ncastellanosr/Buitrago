import { Router } from "express";
import { doTransaction } from "../controllers/transactionController";

const router = Router();

router.post("/make_transaction", doTransaction);

export default router;
