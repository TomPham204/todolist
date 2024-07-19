import { UserDto } from "@/dto/user.dto";
import { User } from "@/entity/user.entity";
import { UserService } from "@/services/user.service";

export class UserController {
	constructor(private userService = new UserService()) { }

	async getUsers() {
		const res = await this.userService.getUsers();
		return res;
	}

	async getUserById(id: string) { }

	async updateUserById(id: string, user: UserDto ) {
		const result = await this.userService.updateUser(parseInt(id), user);
		if (result.affected === 1) return result;
		else throw new Error("Todo not updated");
	 }

	async deleteUserById(id: string) { }
}
