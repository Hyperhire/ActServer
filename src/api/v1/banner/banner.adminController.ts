import { Request, Router, Response } from "express";
import authMiddleware from "../../../middleware/auth.middleware";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import bannerService from "./banner.service";

const router = Router();

router.post(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const newBanner = await bannerService.createBanner(request.body);

            return response.status(201).send({ data: newBanner });
        } catch (error) {
            return response.status(400).send({ error });
        }
    }
);

router.get(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const banners = await bannerService.getBannersByAdmin();

            return response.status(200).send({ data: banners });
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
            const bannerId = request.params.id;
            const updateData = request.body;
            const banner = await bannerService.updateBanner(
                bannerId,
                updateData
            );

            return response.status(200).send({ data: banner });
        } catch (error) {
            return response.status(400).send({ error });
        }
    }
);

export default router;
