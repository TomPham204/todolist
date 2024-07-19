import { Repository } from "typeorm";
import { AppDataSource } from "../database/db.service";
import { User } from "@/entity/user.entity";
import { CreateUserDto } from "@/dto/user.dto";

export class UserService {
	constructor(
		private userRepository: Repository<User> = AppDataSource.getRepository(
			User
		)
	) { }
	createUser(newUser: CreateUserDto) {
		return this.userRepository.insert(newUser);
	}

	async updateUser(id: number) { }

	async getUsers() { }

	async getUserById(id: number) { }
}
