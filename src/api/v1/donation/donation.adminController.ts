import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { validateBody } from "../../../common/helper/validate.helper";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import orderService from "../order/order.service";
import donationService from "./donation.service";
import { kakaopayReady, kakaopayApprove } from "../../../utils/kakaopay";
import { CreateDonationDTO } from "./dto/create-donation.dto";
import authMiddleware from "../../../middleware/auth.middleware";
import { OrderType, UserType } from "../../../common/constants";

const router = Router();

router.get(
    "/org",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const query = request.query;
            const donations = await donationService.getOrgDonationsByAdmin(
                query
            );

            return response.status(200).send({ data: donations });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.get(
    "/campaign",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const query = request.query;
            const donations = await donationService.getCampaignDonationsByAdmin(
                query
            );

            return response.status(200).send({ data: donations });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.get(
    "/org/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const id = request.params.id;
            const donation = await donationService.getOrgDonationByIdByAdmin(
                id
            );
            return response.status(200).json({ data: donation });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.get(
    "/campaign/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const id = request.params.id;
            const donation =
                await donationService.getCampaignDonationByIdByAdmin(id);
            return response.status(200).json({ data: donation });
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
            const updateData = request.body;
            const updatedDonation = donationService.updateDonation(
                id,
                updateData
            );
            return response.status(200).json({ data: updatedDonation });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

export default router;
