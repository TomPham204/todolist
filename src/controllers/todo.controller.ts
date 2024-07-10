import { stat } from "fs";
import { TodoDto } from "./../dto/todo.dto";
import { TodoService } from "@/services/todo.service";
import { Todo } from "@/entity/todo.entity";

export class TodoController {
	constructor(private todoService = new TodoService()) {}

	async get(): Promise<TodoDto[]> {
		const res = await this.todoService.get();
		return res.map((todo: Todo) => ({
			...todo,
			startDate: todo.startDate?.toString()?.split("T")[0],
			endDate: todo.endDate?.toString()?.split("T")[0],
		}));
	}

	async getById(id: string): Promise<TodoDto> {
		const res = await this.todoService.getById(parseInt(id));
		if (!res) throw new Error("Todo not found");
		return <TodoDto>{
			...res,
			startDate: res.startDate?.toString()?.split("T")[0],
			endDate: res.endDate?.toString()?.split("T")[0],
		};
	}

	async create(todo: TodoDto): Promise<TodoDto> {
		if (!!todo.endDate && !todo.startDate)
			throw new Error("Start date is required if end date is provided");

		if (!!todo.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(todo.startDate))
			throw new Error("Invalid startDate format");

		if (!!todo.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(todo.endDate))
			throw new Error("Invalid endDate format");

		const newTodo = await this.todoService.create(todo);
		return <TodoDto>{
			...newTodo,
			startDate: newTodo.startDate?.toString()?.split("T")[0],
			endDate: newTodo.endDate?.toString()?.split("T")[0],
		};
	}

	async update(id: string, todo: TodoDto): Promise<TodoDto> {
		if (!!todo.endDate && !todo.startDate)
			throw new Error("Start date is required if end date is provided");

		if (!!todo.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(todo.startDate))
			throw new Error("Invalid startDate format");

		if (!!todo.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(todo.endDate))
			throw new Error("Invalid endDate format");

		const isExisted = await this.todoService.getById(parseInt(id));
		if (!isExisted) throw new Error("Todo not found");

		const result = await this.todoService.update(parseInt(id), todo);

		if (result.affected === 1) return todo;
		else throw new Error("Todo not updated");
	}

	async delete(id: string): Promise<{ status: string; statusCode: number }> {
		const isExisted = await this.todoService.getById(parseInt(id));
		if (!isExisted) throw new Error("Todo not found");

		const res = await this.todoService.delete(parseInt(id));
		if (res.affected === 1) return { status: "success", statusCode: 204 };
		else throw new Error("Todo not deleted");
	}
}
