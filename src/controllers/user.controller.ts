import { UserService } from "@/services/user.service";

export class UserController {
	constructor(private userService = new UserService()) {}

	async getUsers() {}

	async getUserById(id: string) {}
	
	async updateUserById(id: string) {}

	async deleteUserById(id: string) {}
}
