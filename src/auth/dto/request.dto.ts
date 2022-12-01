import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator"
import { BaseOrgDto } from "../../orgs/dto/request.dto"
import { BaseUserDto } from "../../user/dto/request.dto"

export class RegisterUserDto extends BaseUserDto {
    @IsString({
        message: "Password is required"
    })
    password: string

    @IsBoolean()
    receiveReceipt: boolean = false

    constructor() {
        super()
    }
}

export class RegisterOrgDto extends BaseOrgDto {
    @IsString({
        message: "Password is required"
    })
    password: string

    constructor() {
        super()
    }
}


export class LoginDto {
    @IsEmail({}, { message: "email is required" })
    email: string
    @IsString()
    password: string
}

export class QueryDto {
    @IsString()
    @IsOptional()
    nickname: string
}