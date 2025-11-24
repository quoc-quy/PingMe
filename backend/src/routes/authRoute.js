import express from "express";
import { signIp, signUp } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIp);

export default router;
