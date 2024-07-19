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
		const id = req.params.id;
		if (id != null && !Number.isInteger(Number(id)))
			return res.status(400).json({ message: "Invalid user id" });

		const user = await userController.getUserById(id);
		if (!user) return res.status(404).json({ message: "User not found" });

		return res.status(200).send(user);
	} catch (error) {
		return res.status(500).json({ message: (error as Error).message });
	}
});

userRouter.put("/:id", async (req, res) => {
	try {
	} catch (error) {}
});

userRouter.delete("/:id", async (req, res) => {
	try {
		const userId = Number(req.params.id);
		const result = await userController.deleteUserById(userId);
		
		return res.status(result.statusCode).json({
			"statusCode": result.statusCode,
			"message": result.message
		});
	} catch (error) {
		const err = (error as Error)
		res.status(400).json({ "message": err.message });
	}
});

export { userRouter };
