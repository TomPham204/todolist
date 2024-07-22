import { UserService } from "@/services/user.service";
import { AuthService } from "@/services/auth.service";
import { CreateUserDto, LoginUserDto } from "@/dto/user.dto";
import { QueryFailedError } from "typeorm";
import { z } from "zod";

export class AuthController {
	constructor(
		private authService = new AuthService(),
		private userService = new UserService()
	) { }

	async login(user: z.infer<typeof LoginUserDto>) {
		try {
			const { success, data } = await LoginUserDto.safeParseAsync(user);
			if (!success) {
				throw new Error("Email or password is incorrect")
			}
			const existedUser = await this.userService.getUserByEmail(data.email);
			if (!existedUser) {
				throw new Error("Email or password is incorrect");
			}
			const isValidPassword = await this.authService.compare(data.password, existedUser.password);
			if (!isValidPassword) {
				throw new Error("Email or password is incorrect");
			}
			const token = this.authService.encode({ sub: existedUser.id, email: existedUser.email });
			return token;
		} catch (error) {
			throw new Error("Email or password is incorrect");
		}
	}

	async register(user: z.infer<typeof CreateUserDto>) {
		try {
			const { success, data } = await CreateUserDto.safeParseAsync(user);
			if (!success) {
				throw new Error("Validation Error")
			}
			data.password = await this.authService.hash(data.password);

			await this.userService.createUser(data);
		} catch (error) {
			if (error instanceof QueryFailedError) {
				throw new Error("Email is duplicated")
			}
			throw error;
		}
	}
}
