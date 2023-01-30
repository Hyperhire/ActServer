import { Request, Router, Response } from "express";
import { logger } from "../../../logger/winston.logger";
import authMiddleware from "../../../middleware/auth.middleware";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import userService from "./user.service";

const router = Router();

router.get(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const query = request.query;
            const { pagination, list } = await userService.getList(query);

            return response.status(200).json({ data: { pagination, list } });
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
            const user = await userService.getUserById(id);
            return response.status(200).json({ data: user });
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

            const updatedUser = await userService.updateUser(id, updateData);

            return response.status(200).json({ data: updatedUser });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.delete(
    "/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const deletedUser = await userService.deleteUser(request.params.id);

            return response.status(200).json({ data: deletedUser });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

export default router;
