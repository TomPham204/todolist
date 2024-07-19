import { Todo } from "../entity/todo.entity";
import { TodoDto } from "@/dto/todo.dto";
import { Repository } from "typeorm";
import { AppDataSource } from "../database/db.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export class AuthService {
	constructor() {}

	async hash(password: string) {
		return bcrypt.hash(password, 12);
	}

	async compare(password: string, hashedPassword: string) {
		return bcrypt.compare(password, hashedPassword);
	}

	encode(data: string | Buffer | object) : string {
		return jwt.sign(data, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRATION,
			algorithm: "HS256"
		});
	}

	decode(token: string) {
		return jwt.verify(token, process.env.JWT_SECRET);
	}
}
