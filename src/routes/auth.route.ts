import express from "express";
import { AuthController } from "@/controllers/auth.controller";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/login", async (req, res) => {
	try {
	} catch (error) {}
});

authRouter.post("/register", async (req, res) => {
	try {
	} catch (error) {}
});

export { authRouter };
