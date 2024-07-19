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
		console.log(user, 'user');
		
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

	async getUserById(id: number) { }


}
