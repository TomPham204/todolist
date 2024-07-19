import { UserService } from "@/services/user.service";
import { AuthService } from "@/services/auth.service";

export class AuthController {
	constructor(
		private authService = new AuthService(),
		private userService = new UserService()
	) {}

	async login() {}

	async register() {}
}
