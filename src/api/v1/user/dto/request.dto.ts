import { IsDateString, IsEmail, IsObject, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose"

export class BaseUserDto {

    @IsOptional()
    @IsString()
    _id: Types.ObjectId

    @IsEmail()
    email: string

    @IsString({
        message: "Nickname is required"
    })
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
    @IsObject()
    @IsOptional()
    wallet: object;
}

