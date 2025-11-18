import { Router } from "express";
import { register, login, changePassword } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/changepassword", changePassword);

export default router;
