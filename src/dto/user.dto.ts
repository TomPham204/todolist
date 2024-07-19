import {
	IsOptional,
	IsString,
	Length,
	MaxLength,
	MinLength,
} from "class-validator";

export class UserDto {
	id: number;

	@IsString()
	@MaxLength(80)
	@MinLength(1)
	name: string;

	@IsString()
	@Length(5, 5)
	availableStart: string;

	@IsString()
	@Length(5, 5)
	availableEnd: string;
}
