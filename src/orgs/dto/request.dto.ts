import { IsEmail, IsString } from "class-validator"

export class BaseOrgDto {
    @IsEmail()
    email: string
    @IsString()
    nickname: string
    @IsString()
    orgName: string
    @IsString()
    corporateId: string
    @IsString()
    managerName: string
    @IsString()
    managerMobile: string
    @IsString()
    homepage: string
}