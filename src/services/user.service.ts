import { DeleteResult, Repository } from "typeorm";
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

	async getUserById(id: number) {
		return (await this.userRepository.findOne({ where: { id } })) || null;
	}

	async deleteUserById(id: number): Promise<DeleteResult> {
		if (id == null || !Number(id)) {
			throw new Error("Invalid Id");
		}
		
		const user = await this.userRepository.findOneBy({ id: id });
		if (user == null) {
			throw new Error("User not exists");
		}

		return await this.userRepository.delete({ id: user.id });
	}
}
