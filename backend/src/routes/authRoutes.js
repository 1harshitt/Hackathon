import { Router } from "express";
import { login } from "../controllers/authController/index.js";

const router = Router();

router.post("/login", login.validator, login.handler);


export default router;
