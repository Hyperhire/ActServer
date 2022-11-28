import { IsDateString, IsEmail, IsOptional, IsString } from "class-validator"

export class BaseUserDto {

    @IsString()
    _id: string

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    nickname: string

    @IsDateString()
    @IsOptional()
    createdAt: Date
    @IsDateString()
    @IsOptional()
    updatedAt: Date
}