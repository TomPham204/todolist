import express from "express";
import { UserController } from "@/controllers/user.controller";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/", async (req, res) => {
	try {
	} catch (error) {}
});

userRouter.get("/:id", async (req, res) => {
	try {
	} catch (error) {}
});

userRouter.put("/:id", async (req, res) => {
	try {
	} catch (error) {}
});

userRouter.delete("/:id", async (req, res) => {
	try {
	} catch (error) {}
});

export { userRouter };
