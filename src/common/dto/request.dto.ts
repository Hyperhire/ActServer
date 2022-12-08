import { Type } from "class-transformer"
import { IsNumber, IsNumberString, IsString } from "class-validator"
import { Types } from "mongoose"
import 'reflect-metadata'

export class PaginationDto {
    @IsNumber()
    @Type(() => Number) 
    page: number = 0
    @IsNumber()
    @Type(() => Number) 
    limit: number = 0
}

export class IdDto {
    @IsString()
    id: string
}