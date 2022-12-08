import { IsString } from "class-validator"

export class FAQDto {
    @IsString()
    question: string
    @IsString()
    answer: string
}