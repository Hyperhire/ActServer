import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { validateBody } from "../../../common/helper/validate.helper";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import campaignsService from "./campaigns.service";
import { CreateCampaignDto } from "./dto/request.dto";
import { CampaignDto, CampaignOrgDto } from "./dto/response.dto";
import { UserType } from "../../../common/constants";
import authMiddleware from "../../../middleware/auth.middleware";
import donationService from "../donation/donation.service";
import { uploadFileToS3 } from "../../../utils/upload";

interface MulterRequest extends Request {
    files: any;
}

const router = Router();

router.post(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    uploadFileToS3("campaigns").array("images"),
    async (request: MulterRequest, response: Response) => {
        try {
            const files = request.files;
            if (!files || !files.length) {
                throw "no Images are added";
            }

            const { data } = request.body;
            if (!data) {
                throw "no Data";
            }
            const _data = JSON.parse(data);

            const createData = {
                ..._data,
                images: request.files.map((file) => file.location),
            };

            const campaign: CampaignDto = await campaignsService.create(
                createData
            );

            return response.status(201).json({ data: campaign });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.get(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const query = request.query;
            const { pagination, list } = await campaignsService.getListByAdmin(
                query
            );

            return response.status(200).json({
                data: {
                    pagination,
                    list,
                },
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
            const campaign = await campaignsService.getCampaignByIdByAdmin(
                request.params.id
            );

            return response.status(200).json({
                data: campaign,
            });
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
            const updated = await campaignsService.update(id, request.body);
            return response.status(201).json({ data: updated });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.get(
    "/list-by-org/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const campaign = await campaignsService.getAllCampaignsByOrgId(
                request.params.id
            );

            return response.status(200).json({ data: campaign });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

export default router;
