import {
	IsString,
	MaxLength,
	MinLength,
	IsNotEmpty,
	IsOptional,
} from "class-validator";

export class UpdateUserDto {
	@IsString()
	@MaxLength(80)
	@MinLength(1)
	@IsOptional()
	name: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	availableStart: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	availableEnd: string;
}
