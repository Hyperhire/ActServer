import { Request, Router, Response } from "express";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import newsService from "./news.service";
import { UserType } from "./../../../common/constants";
import authMiddleware from "../../../middleware/auth.middleware";
import { uploadFile } from "../../../utils/upload";

interface MulterRequest extends Request {
  files: any;
}

const router = Router();

// create news
router.post(
  "/",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyOrg,
  uploadFile("news").array("images"),
  async (request: MulterRequest, response: Response) => {
    try {
      const { id, userType } = request["user"];
      const files = request.files;
      if (!files || !files.length) {
        throw "no Images are added";
      }
      
      const { data } = request.body;
      if (!data) {
        throw "no Data";
      }
      const _data = JSON.parse(data);


      const news = await newsService.createNews({
        ..._data,
        images: request.files.map(file => file.location),
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
