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
    
    @IsString()
    @IsOptional()
    recurringOn: string
    
    @IsNumber()
    amount: number
}