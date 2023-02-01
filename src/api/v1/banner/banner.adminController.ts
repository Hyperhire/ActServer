import { Request, Router, Response } from "express";
import authMiddleware from "../../../middleware/auth.middleware";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import { uploadFileToS3 } from "../../../utils/upload";
import bannerService from "./banner.service";

interface MulterRequest extends Request {
    file: any;
}

const router = Router();

router.post(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    uploadFileToS3("banner").single("image"),
    async (request: MulterRequest, response: Response) => {
        try {
            const file = request.file;
            const data = request.body;
            if (file?.location) {
                data.imageUrl = file.location;
            }
            const newBanner = await bannerService.createBanner(data);

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

router.get(
    "/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const bannerId = request.params.id;
            const banner = await bannerService.getBannerByIdByAdmin(bannerId);

            return response.status(200).send({ data: banner });
        } catch (error) {
            return response.status(400).send({ error });
        }
    }
);

router.patch(
    "/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    uploadFileToS3("banner").single("image"),
    async (request: MulterRequest, response: Response) => {
        try {
            const bannerId = request.params.id;
            const file = request.file;

            const updateData = request.body;
            if (file?.location) {
                updateData.imageUrl = file.location;
            }

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
