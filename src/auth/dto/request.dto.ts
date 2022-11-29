import { IsEmail, IsString } from "class-validator"
import { BaseOrgDto } from "../../orgs/dto/request.dto"
import { BaseUserDto } from "../../user/dto/request.dto"

export class RegisterUserDto extends BaseUserDto {
    @IsString()
    password: string

    constructor() {
        super()
    }
}

export class RegisterOrgDto extends BaseOrgDto {
    @IsString()
    password: string

    constructor() {
        super()
    }
}


export class LoginDto {
    @IsEmail()
    email: string
    @IsString()
    password: string
}