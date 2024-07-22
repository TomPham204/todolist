import { IsString, MaxLength, MinLength, IsNotEmpty } from "class-validator";

export class CreateUserDto {
	@IsString()
	@MaxLength(80)
	@MinLength(1)
	name: string;

	@IsString()
	@IsNotEmpty()
	availableStart: string;

	@IsString()
	@IsNotEmpty()
	availableEnd: string;
}
