import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class CreateUserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MaxLength(72)
    @MinLength(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}