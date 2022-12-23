import { Request, Router, Response } from "express";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import newsService from "./news.service";
import { UserType } from "./../../../common/constants";
import authMiddleware from "../../../middleware/auth.middleware";

const router = Router();

// create news
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
      const news = await newsService.createNews({
        ...request.body,
        orgId: id
      });

      return response.status(201).json({ data: news });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

// news list
router.get("/", async (request: Request, response: Response) => {
  try {
    const query = request.query;
    const news = await newsService.getNews(query);

    return response.status(200).json({ data: news });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

// news detail
router.get("/:id", async (request: Request, response: Response) => {
  try {
    const newsId = request.params.id;
    const news = await newsService.getNewsById(newsId);

    return response.status(200).json({ data: news });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

// news by org id
router.get("/list-by-org/:id", async (request: Request, response: Response) => {
  try {
    const newsId = request.params.id;
    const news = await newsService.getNewsByOrgId(newsId);

    return response.status(200).json({ data: news });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});
export default router;
