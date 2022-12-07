import "reflect-metadata";

import { Type } from "class-transformer"
import { IsDate, IsDateString, IsString } from "class-validator"

export class CreateCampaignDto {
    @IsString()
    name: string
    @IsString()
    orgId: string

    @Type(() => Date)
    @IsDate()
    start_at: Date

    @Type(() => Date)
    @IsDate()
    end_at: Date
}
