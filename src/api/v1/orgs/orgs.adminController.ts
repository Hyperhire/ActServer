import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { UserType } from "../../../common/constants";
import { IdDto } from "../../../common/dto/request.dto";
import { validateBody } from "../../../common/helper/validate.helper";
import { logger } from "../../../logger/winston.logger";
import authMiddleware from "../../../middleware/auth.middleware";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import { uploadFileToS3 } from "../../../utils/upload";
import subscriptionService from "../subscription/subscription.service";
import { BaseOrgDto } from "./dto/request.dto";
import orgsService from "./orgs.service";

interface MulterRequest extends Request {
    files: any;
}

const router = Router();

// create org
router.post(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const newOrg = await orgsService.createOrg(request.body);
            return response.status(201).json({ data: newOrg });
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
    uploadFileToS3("images").fields([
        { name: "logo", maxCount: 1 },
        { name: "images", maxCount: 3 },
    ]),
    async (request: MulterRequest, response: Response) => {
        try {
            const { id } = request.params;
            const files = request.files;

            const { data } = request.body;
            if (!data) {
                throw "no Data";
            }

            const updateData = {
                ...JSON.parse(data),
            };

            if (files.logo.length) {
                updateData.logoURL = files.logo[0].location;
            }
            if (files.images) {
                updateData.imageUrls = files.images.map(
                    (file) => file.location
                );
            }

            const updatedOrg = await orgsService.updateOrgByAdmin(
                id,
                updateData
            );
            return response.status(200).json({ data: updatedOrg });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

// get orgs list
router.get(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const query = request.query;
            const { pagination, list } = await orgsService.getListByAdmin(
                query
            );

            return response.status(200).json({ data: { pagination, list } });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

// get orgs detail
router.get(
    "/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const org = await orgsService.getOrgByIdByAdmin(request.params.id);

            return response.status(200).json({
                data: org,
            });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

// get orgs detail
router.patch(
    "/delete/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const org = await orgsService.deleteOrg(request.params.id);

            return response.status(200).json({
                data: org,
            });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

export default router;
