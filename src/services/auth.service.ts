import { Todo } from "../entity/todo.entity";
import { TodoDto } from "@/dto/todo.dto";
import { Repository } from "typeorm";
import { AppDataSource } from "../database/db.service";
import bcrypt from "bcrypt";

export class AuthService {
	constructor() {}

	async login() {}

	async register() {}

	async hash(password: string) {
		return bcrypt.hash(password, 12);
	}

	async compare(password: string, hashedPassword: string) {
		return bcrypt.compare(password, hashedPassword);
	}
}
