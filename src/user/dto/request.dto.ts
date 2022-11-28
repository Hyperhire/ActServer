import { IsDateString, IsEmail, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose"

export class BaseUserDto {

    @IsString()
    _id: Types.ObjectId

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