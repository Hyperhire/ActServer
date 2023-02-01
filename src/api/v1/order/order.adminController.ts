import { Request, Router, Response } from "express";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import orderService from "./order.service";
import {
    OrderPaidStatus,
    OrderPaymentType,
    OrderType,
} from "../../../common/constants";
import authMiddleware from "../../../middleware/auth.middleware";

const router = Router();

router.get(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const query = request.body;
            const orders = await orderService.getOrdersByAdmin(query);

            return response.status(200).json({
                data: orders,
            });
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
            const id = request.params.id;
            const order = await orderService.getOrderByIdByAdmin(id);

            return response.status(200).json({
                data: order,
            });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

export default router;
