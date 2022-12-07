import { Type } from "class-transformer"
import { IsNumber, IsNumberString } from "class-validator"
import 'reflect-metadata'

export class PaginationDto {
    @IsNumber()
    @Type(() => Number) 
    page: number = 0
    @IsNumber()
    @Type(() => Number) 
    limit: number = 0
}