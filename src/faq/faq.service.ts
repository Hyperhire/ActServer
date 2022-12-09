import { PaginationDto } from "../common/dto/request.dto";
import { FAQDto } from "./dto/request.dto";
import { FAQModel } from "./schema/faq.schema";

const createFaq = async (faqDto: Array<FAQDto>) => {
    try {
        const faqs: Array<FAQDto> = await FAQModel.create(faqDto)
        
        return faqs
    } catch (error) {
        throw error
    }
}

const getFaqs = async (paginationDto: PaginationDto): Promise<Array<FAQDto>> => {
    try {
        const faqs: Array<FAQDto> = await FAQModel.find({}).skip(paginationDto.limit * paginationDto.page).limit(paginationDto.limit)

        return faqs
    } catch (error) {
        throw error
    }
}

export default {
    createFaq,
    getFaqs
}