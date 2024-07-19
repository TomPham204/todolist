import { Todo } from "./../entity/todo.entity";
import { TodoDto } from "@/dto/todo.dto";
import { Repository } from "typeorm";
import { AppDataSource } from "../database/db.service";

export class TodoService {
	constructor(
		private todoRepository: Repository<Todo> = AppDataSource.getRepository(
			"Todo"
		)
	) {}
	async get() {
		const res = await this.todoRepository.find();
		return res;
	}

	async getById(id: number) {
		return (await this.todoRepository.findOne({ where: { id } })) || null;
	}

	async create(todo: TodoDto) {
		const formattedTodo = {
			name: todo.name,
			startDate: !!todo.startDate ? new Date(todo.startDate) : null,
			endDate: !!todo.endDate ? new Date(todo.endDate) : null,
		};
		const res = await this.todoRepository.save(formattedTodo);
		return res;
	}

	async update(id: number, todo: TodoDto) {
		return await this.todoRepository.update(id, todo);
	}

	async delete(id: number) {
		return await this.todoRepository.delete(id);
	}
}