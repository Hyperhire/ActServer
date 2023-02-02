import { Request, Router, Response } from "express";
import { logger } from "../../../logger/winston.logger";
import authMiddleware from "../../../middleware/auth.middleware";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import { uploadFileToS3 } from "../../../utils/upload";
import userService from "./user.service";

interface MulterRequest extends Request {
    file: any;
}

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
    uploadFileToS3("user").single("image"),
    async (request: MulterRequest, response: Response) => {
        try {
            const id = request.params.id;
            const data = request.body;
            const file = request.file;
            if (file) {
                data.profileUrl = file.location;
            }
            const updatedUser = await userService.updateUser(id, data);

            return response.status(200).json({ data: updatedUser });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.patch(
    "/delete/:id",
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
