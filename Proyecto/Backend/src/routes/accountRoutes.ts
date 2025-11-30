import { Router } from 'express';
import { accountCount, createAcc, deactivateAcc, getAccounts } from '../controllers/accountControllet';
const router = Router();

router.post( "/create", createAcc);
router.post( "/deactivate", deactivateAcc);
router.post( "/active-accounts", getAccounts);
router.post("/count", accountCount);

export default router;