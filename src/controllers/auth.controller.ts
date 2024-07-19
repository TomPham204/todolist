import { UserService } from "@/services/user.service";
import { AuthService } from "@/services/auth.service";
import { CreateUserDto } from "@/dto/user.dto";
import { QueryFailedError } from "typeorm";
import { z } from "zod";

export class AuthController {
	constructor(
		private authService = new AuthService(),
		private userService = new UserService()
	) { }

	async login() { }

	async register(user: z.infer<typeof CreateUserDto>) {
		try {
			const { success, data, error } = await CreateUserDto.safeParseAsync(user);
			if (!success) {
				throw new Error("Validation Error")
			}
			data.password = await this.authService.hash(data.password);

			await this.userService.createUser(data);
		} catch (error) {
			if (error instanceof QueryFailedError) {
				console.log(error.name);
				throw new Error("Email is duplicated")
			}
			throw error;
		}
	}
}
