import { IsDateString, IsEmail, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose"

export class BaseUserDto {

    @IsOptional()
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

    constructor() {

    }
}

export class UserDto extends BaseUserDto {
    @IsString()
    password: string
}
