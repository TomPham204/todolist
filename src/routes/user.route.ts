import express from "express";
import { UserController } from "@/controllers/user.controller";
import { UserService } from "@/services/user.service";
import { Repository } from "typeorm";
import { AppDataSource } from "@/database/db.service";
import { User } from "@/entity/user.entity";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/", async (req, res) => {
	try {
		const users = await userController.getUsers();
		res.status(200).json(users);
	} catch (error) { }
});

userRouter.post("/", async (req, res) => {
	const  userRepository: Repository<User> = AppDataSource.getRepository(
		"User"
	)
	try {
		const user = await userRepository.save(req.body);
		return res.status(201).json(user);
	} catch (error) {
		res.status(400).send({ message: (error as Error).message });
	}
})

userRouter.get("/:id", async (req, res) => {
	try {
	} catch (error) { }
});

userRouter.put("/:id", async (req, res) => {
	const id=req.params.id
	if(id == null || !Number.isInteger(Number(id))) {
		return res.status(400).send({ message: "Invalid ID" });
	}

	const body=req.body
	if(body == null || !body.name || !body.availableStart || !body.availableEnd) {
		return res.status(400).send({ message: "Invalid body" });
	}

	try {
		const user = await userController.updateUserById(id, req.body);
		return res.status(200).json(user);
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
});

userRouter.delete("/:id", async (req, res) => {
	try {
	} catch (error) { }
});

export { userRouter };
