import { Repository } from "typeorm";
import { AppDataSource } from "../database/db.service";
import { User } from "@/entity/user.entity";
import { CreateUserDto } from "@/dto/user.dto";
import { z } from "zod";

export class UserService {
	constructor(
		private userRepository: Repository<User> = AppDataSource.getRepository(
			User
		)
	) { }
	createUser(newUser: z.infer<typeof CreateUserDto>) {
		return this.userRepository.insert(newUser);
	}

	async updateUser(id: number) { }

	async getUsers() { }

	async getUserById(id: number) { }

	async getUserByEmail(email: string) {
		return this.userRepository.findOne({
			where: {
				email: email
			}
		})
	}
}
