import { Router } from 'express';
import { createAcc, deactivateAcc } from '../controllers/accountControllet';
const router = Router();

router.post( "/create", createAcc);
router.post( "/deactivate", deactivateAcc);

export default router;