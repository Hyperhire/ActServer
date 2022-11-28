import { IsEmail, IsString } from "class-validator";
import { BaseUserDto } from "../../user/dto/request.dto";

export class RegisterUserDto extends BaseUserDto {
    @IsString()
    password: string
}

export class LoginUserDto {
    @IsEmail()
    email: string
    @IsString()
    password: string
}