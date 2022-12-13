import { Request, Router, Response } from "express";
import { plainToInstance } from "class-transformer";
import { FAQDto } from "./dto/request.dto";
import faqService from "./faq.service";
import { logger } from "../../../logger/winston.logger";

const router = Router();

router.get("/", async (request: Request, response: Response) => {
  try {
    const faqs: Array<FAQDto> = await faqService.getFaqs();
    return response.status(201).json({ data: faqs });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

// router.post("/", async (request: Request, response: Response) => {
//     try {
//         const faqDto = plainToInstance(Array<FAQDto>, request.body)
//         await validateBody<Array<FAQDto>>(faqDto)
//         const faqs: Array<FAQDto> = await faqService.createFaq(faqDto)
//         return response.status(200).json(faqs)
//     } catch (error) {
//         logger.error(error)
//         return response.status(400).json({ error })
//     }
// })

export default router;
