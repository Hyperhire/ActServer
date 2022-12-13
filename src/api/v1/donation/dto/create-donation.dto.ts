import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateDonationDTO {
    @IsString()
    type: string

    @IsString()
    @IsOptional()
    orgId: string

    @IsString()
    @IsOptional()
    campaignId: string

    @IsBoolean()
    isRecurring: boolean

    @IsNumber()
    @IsOptional()
    recurringCount: number
    
    @IsString()
    @IsOptional()
    recurringOn: string
    
    @IsNumber()
    amount: number

    @IsString()
    @IsOptional()
    nftId: string
}