import express from "express";
import { TodoController } from "@/controllers/todo.controller";
import { TodoMiddleware } from "@/middlewares/todo.middleware";

const todoRouter = express.Router();
const todoController = new TodoController();

todoRouter.get("/", async (req, res) => {
	try {
		const todos = await todoController.get();
		res.status(200).json(todos);
	} catch (error) {
		res.status(400).send({ message: (error as Error).message });
	}
});

todoRouter.get("/:id", TodoMiddleware.isValidUserId, async (req, res) => {
	try {
		const todo = await todoController.getById(req.params.id);
		return res.status(200).json(todo);
	} catch (error) {
		res.status(404).send({ message: (error as Error).message });
	}
});

todoRouter.post("/", async (req, res) => {
	try {
		const todo = await todoController.create(req.body);
		return res.status(201).json(todo);
	} catch (error) {
		res.status(400).send({ message: (error as Error).message });
	}
});

todoRouter.put("/:id", TodoMiddleware.isValidUserId, async (req, res) => {
	try {
		const todo = await todoController.update(req.params.id, req.body);
		return res.status(200).json(todo);
	} catch (error) {
		res.status(400).send({ message: (error as Error).message });
	}
});

todoRouter.delete("/:id", TodoMiddleware.isValidUserId, async (req, res) => {
	try {
		await todoController.delete(req.params.id);
		return res.status(204).send();
	} catch (error) {
		res.status(400).send({ message: (error as Error).message });
	}
});

export { todoRouter };
