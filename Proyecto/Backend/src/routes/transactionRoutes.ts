import { Router } from "express";
import { getTransactions, makeTransaction, transactionCount } from "../controllers/transactionController";

const router = Router();

router.post("/new", makeTransaction);
router.post("/count", transactionCount);
router.post("/get", getTransactions);
export default router;
