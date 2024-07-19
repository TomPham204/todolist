import { User } from "@/entity/user.entity";
import { UserService } from "@/services/user.service";

export class UserController {
	constructor(private userService = new UserService()) { }

	async getUsers() {
		const res = await this.userService.getUsers();
		return res;
	}

	async getUserById(id: string) { }

	async updateUserById(id: string) { }

	async deleteUserById(id: string) { }
}
