import { IsEmail, IsString } from "class-validator"
import { Types } from "mongoose"

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

export class OrgDto extends BaseOrgDto {
    @IsString()
    password: string

    @IsString()
    _id: Types.ObjectId
}
