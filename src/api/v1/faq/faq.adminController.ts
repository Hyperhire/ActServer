import { Request, Router, Response } from "express";
import { plainToInstance } from "class-transformer";
import { FAQDto } from "./dto/request.dto";
import faqService from "./faq.service";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import authMiddleware from "../../../middleware/auth.middleware";

const router = Router();

router.get(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const query = request.query;
            const faqs: Array<FAQDto> = await faqService.getFaqsByAdmin(query);
            return response.status(200).json({ data: faqs });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.get(
    "/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const faq = await faqService.getFaqByIdByAdmin(request.params.id);
            return response.status(200).json({ data: faq });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.post(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const faq = await faqService.createFaq(request.body);
            return response.status(201).json({ data: faq });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.patch(
    "/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const id = request.params.id;
            const faq = await faqService.updateFaq(id, request.body);
            return response.status(201).json({ data: faq });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

export default router;
