import { Request, Response, Router } from "express";
import withdrawService from "./withdraw.service";
import orgsService from "../orgs/orgs.service";
import authMiddleware from "../../../middleware/auth.middleware";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import { config } from "../../../config/config";
import orderService from "../order/order.service";
import { OrderWithdrawRequestStatus } from "../../../common/constants";

const router = Router();

router.get(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const query = request.query;
            const withdraw = await withdrawService.getWithdrawsByAdmin(query);

            return response.status(200).send({ data: withdraw });
        } catch (error) {
            return response.status(400).send({ error });
        }
    }
);

router.get(
    "/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const withdraw = await withdrawService.getWithdrawById(
                request.params.id
            );

            return response.status(200).send({ data: withdraw });
        } catch (error) {
            return response.status(400).send({ error });
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
            const updatedWithdraw = await withdrawService.updateWithdraw(
                id,
                request.body
            );
            return response.status(201).send({ data: updatedWithdraw });
        } catch (error) {
            return response.status(400).send({ error });
        }
    }
);

export default router;
