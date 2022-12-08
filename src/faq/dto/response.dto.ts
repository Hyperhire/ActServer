import { IsString } from "class-validator"

export class FAQ {
    @IsString()
    question: string
    @IsString()
    answer: string
}