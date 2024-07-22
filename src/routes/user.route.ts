import { validate } from "class-validator";
import express from "express";
import { UserController } from "@/controllers/user.controller";
import { UserService } from "@/services/user.service";
import { Repository } from "typeorm";
import { AppDataSource } from "@/database/db.service";
import { User } from "@/entity/user.entity";
import { CreateUserDto } from "@/dto/create-user.dto";
import RequestValidator from "@/middlewares/class-validate.middleware";
import { UpdateUserDto } from "@/dto/update-user.dto";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/", async (req, res) => {
	try {
		const users = await userController.getUsers();
		res.status(200).json(users);
	} catch (error) {}
});

userRouter.post(
	"/",
	async (req, res, next) =>
		RequestValidator.validateBody(req, res, next, CreateUserDto),
	async (req, res) => {
		const userRepository: Repository<User> =
			AppDataSource.getRepository("User");
		try {
			const user = await userRepository.save(req.body);
			return res.status(201).json(user);
		} catch (error) {
			res.status(400).send({ message: (error as Error).message });
		}
	}
);

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

userRouter.put(
	"/:id",
	async (req, res, next) =>
		RequestValidator.validateBody(req, res, next, UpdateUserDto),
	async (req, res) => {
		const id = req.params.id;
		if (id == null || !Number.isInteger(Number(id))) {
			return res.status(400).send({ message: "Invalid ID" });
		}

		const body = req.body;
		if (
			body == null ||
			!body.name ||
			!body.availableStart ||
			!body.availableEnd
		) {
			return res.status(400).send({ message: "Invalid body" });
		}

		try {
			const user = await userController.updateUserById(id, req.body);
			return res.status(200).json(user);
		} catch (error) {
			return res.status(400).send({ message: (error as Error).message });
		}
	}
);

userRouter.delete("/:id", async (req, res) => {
	try {
		const userId = Number(req.params.id);
		const result = await userController.deleteUserById(userId);

		return res.status(result.statusCode).json({
			statusCode: result.statusCode,
			message: result.message,
		});
	} catch (error) {
		const err = error as Error;
		res.status(400).json({ message: err.message });
	}
});

export { userRouter };
