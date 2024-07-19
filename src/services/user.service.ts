import { Repository } from "typeorm";
import { AppDataSource } from "../database/db.service";
import { User } from "@/entity/user.entity";

export class UserService {
	constructor(
		private userRepository: Repository<User> = AppDataSource.getRepository(
			"User"
		)
	) {}
	async createUser() {}

	async updateUser(id: number) {}

	async getUsers() {}

	async getUserById(id: number): Promise<User> {
		return (await this.userRepository.findOne({ where: { id } })) || null;
	}
}
