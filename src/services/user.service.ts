import { Repository } from "typeorm";
import { AppDataSource } from "../database/db.service";
import { User } from "@/entity/user.entity";

export class UserService {
	constructor(
		private userRepository: Repository<User> = AppDataSource.getRepository(
			"User"
		)
	) { }
	//async createUser() {}
	async createUser(user: User) {
		const formattedUser = {
			name: user.name,
			availabletart: user.availableStart,
			availableEnd: user.availableEnd,
		};
		const res = await this.userRepository.save(formattedUser);
		return res;
	}

	async updateUser(id: number) { }

	async getUsers() {
		const res = await this.userRepository.find();
		return res;
	}

	async getUserById(id: number) { }


}
