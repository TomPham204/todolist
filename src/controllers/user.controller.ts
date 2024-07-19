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

	async deleteUserById(id: number): Promise<{ statusCode: number, message: string }> {
		const response = (await this.userService.deleteUserById(id)).affected;
		if (response != 1) {
			return { statusCode: 400, message: "failed" };
		}

		return { statusCode: 200, message: "success" };
	}
}
