import { Request, Router, Response } from "express";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import noticeService from "./notice.service";
import { UserType } from "./../../../common/constants";
import authMiddleware from "../../../middleware/auth.middleware";

const router = Router();

// create notice
router.post(
  "/",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyOrg,
  async (request: Request, response: Response) => {
    try {
      const { id, userType } = request["user"];
      if (userType !== UserType.ORGANIZATION) {
        throw "Unauthorized access";
      }
      const _notice = await noticeService.createNotice({
        ...request.body,
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
