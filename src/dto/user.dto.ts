import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UserDto {
	id: number;

	@IsString()
	@MaxLength(80)
	@MinLength(1)
	name: string;

	@IsString()
	availableStart: string;

	@IsString()
	availableEnd: string;
}
