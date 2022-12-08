import { plainToInstance } from 'class-transformer'
import { Request, Router, Response } from 'express'
import { PaginationDto } from '../common/dto/request.dto'
import { validateBody } from '../common/helper/validate.helper'
import { logger } from '../logger/winston.logger'
import { FAQDto } from './dto/request.dto'
import faqService from './faq.service'

const router = Router()

router.get("/", async (request: Request, response: Response) => {
    try {
        const paginationDto = plainToInstance(PaginationDto, request.params)
        await validateBody<PaginationDto>(paginationDto)
        const faqs: Array<FAQDto> = await faqService.getFaqs(paginationDto)
        return response.status(400).json(faqs)
    } catch (error) {
        logger.error(error)
        return response.status(400).json({ error })
    }
})

router.post("/", async (request: Request, response: Response) => {
    try {
        const faqDto = plainToInstance(Array<FAQDto>, request.params)
        await validateBody<Array<FAQDto>>(faqDto)
        const faqs: Array<FAQDto> = await faqService.createFaq(faqDto)
        return response.status(200).json(faqs)
    } catch (error) {
        logger.error(error)
        return response.status(400).json({ error })
    }
})

export default router
