import { UserDto } from "@/dto/user.dto";
import { UserService } from "@/services/user.service";

export class UserController {
	constructor(private userService = new UserService()) {}

	async getUsers() {}

	async getUserById(id: string): Promise<UserDto> {
		const user = await this.userService.getUserById(parseInt(id));
		return <UserDto>user;
	}

	async updateUserById(id: string) {}

	async deleteUserById(id: string) {}
}
