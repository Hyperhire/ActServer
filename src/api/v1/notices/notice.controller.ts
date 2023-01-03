import { Request, Router, Response } from "express";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import noticeService from "./notice.service";
import { UserType } from "./../../../common/constants";
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
  authMiddleware.validOnlyOrg,
  uploadFile("notice").array("images"),
  async (request: MulterRequest, response: Response) => {
    try {
      const { id, userType } = request["user"];

      const files = request.files;
      if (!files || !files.length) {
        throw "no Images are added";
      }

      const _notice = await noticeService.createNotice({
        ...request.body,
        images: request.files.map(file => file.location),
        orgId: id
      });

      return response.status(201).json({ data: _notice });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

// notice list
router.get("/", async (request: Request, response: Response) => {
  try {
    const query = request.query;
    const _notice = await noticeService.getNotice(query);

    return response.status(200).json({ data: _notice });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

// notice detail
router.get("/:id", async (request: Request, response: Response) => {
  try {
    const newsId = request.params.id;
    const _notice = await noticeService.getNoticeById(newsId);

    return response.status(200).json({ data: _notice });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

// notice by org id
router.get("/list-by-org/:id", async (request: Request, response: Response) => {
  try {
    const newsId = request.params.id;
    const _notice = await noticeService.getNoticeByOrgId(newsId);

    return response.status(200).json({ data: _notice });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

export default router;
