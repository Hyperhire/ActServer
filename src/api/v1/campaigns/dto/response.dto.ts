import { IsDateString, IsOptional, IsString } from "class-validator"
import { Schema, Types } from "mongoose"
import { BaseOrgDto } from "../../orgs/dto/request.dto"

export class CampaignDto {
    @IsString()
    _id: Types.ObjectId
    @IsString()
    name: string

    @IsDateString()
    start_at: Date
    @IsDateString()
    end_at: Date

    @IsString()
    orgId: Types.ObjectId
}


export class CampaignOrgDto {
    @IsString()
    _id: Types.ObjectId
    @IsString()
    name: string

    @IsDateString()
    start_at: Date
    @IsDateString()
    end_at: Date

    org: BaseOrgDto
    images: Array<string>

    @IsOptional()
    short_description: string
    @IsOptional()
    long_description: string

    @IsOptional()
    target: string
}

