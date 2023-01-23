import { Request, Router, Response } from "express";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import noticeService from "./notice.service";
import { UserType } from "../../../common/constants";
import authMiddleware from "../../../middleware/auth.middleware";
import { uploadFile } from "../../../utils/upload";

interface MulterRequest extends Request {
    files: any;
}

const router = Router();

// create notice
router.post(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    uploadFile("notice").array("images"),
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

            const _notice = await noticeService.createNotice({
                ..._data,
                images: request.files.map((file) => file.location),
            });

            return response.status(201).json({ data: _notice });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

// notice list
router.get(
    "/",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const query = request.query;
            const _notice = await noticeService.getNotice(query);

            return response.status(200).json({ data: _notice });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

// notice detail
router.get(
    "/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const noticeId = request.params.id;
            const _notice = await noticeService.getNoticeById(noticeId);

            return response.status(200).json({ data: _notice });
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
            const notice = await noticeService.updateNotice(id, request.body);
            return response.status(201).json({ data: notice });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

// notice by org id
router.get(
    "/list-by-org/:id",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const noticeId = request.params.id;
            const _notice = await noticeService.getNoticeByOrgId(noticeId);

            return response.status(200).json({ data: _notice });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

export default router;
