import { DeleteResult, Repository } from "typeorm";
import { AppDataSource } from "../database/db.service";
import { User } from "@/entity/user.entity";

export class UserService {
	constructor(
		private userRepository: Repository<User> = AppDataSource.getRepository(
			"User"
		)
	) { }
	
	async createUser(user: User): Promise<User> {
		const formattedUser = {
			name: user.name,
			availableStart: user.availableStart,
			availableEnd: user.availableEnd,
		};
		
		const res = await this.userRepository.save(formattedUser);
		return res;
	}

	async updateUser(id: number, user:User ) { 
		const existedUser = await this.userRepository.findOne({ where: { id } }) || null;
		if (!existedUser) throw new Error("User not found");
		const result = await this.userRepository.update(id, user);
		return result;
	}

	async getUsers() {
		const res = await this.userRepository.find();
		return res;
	}

	async getUserById(id: number) {
		return (await this.userRepository.findOne({ where: { id } })) || null;
	}

	async deleteUserById(id: number): Promise<DeleteResult> {
		if (id == null || !Number(id)) {
			throw new Error("Invalid id");
		}
		
		const user = await this.userRepository.findOneBy({ id: id });
		if (user == null) {
			throw new Error("User not exists");
		}

		return await this.userRepository.delete({ id: user.id });
	}
}
