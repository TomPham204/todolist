import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class TodoDto {
	id: number;

	@IsString()
	@MaxLength(80)
	@MinLength(1)
	name: string;

	@IsOptional()
	startDate?: string;

	@IsOptional()
	endDate?: string;
}
