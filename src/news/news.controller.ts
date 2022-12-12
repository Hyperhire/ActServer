import { Request, Router, Response } from "express";
import { logger } from "../logger/winston.logger";
import newsService from "./news.service";

const router = Router();

// create news
router.post("/", async (request: Request, response: Response) => {
  try {
    const news = await newsService.createNews(request.body);

    return response.status(201).json({ data: news });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

// news list
router.get("/", async (request: Request, response: Response) => {
  try {
    const news = await newsService.getNews();

    return response.status(201).json({ data: news });
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

    return response.status(201).json({ data: news[0] });
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

    return response.status(201).json({ data: news });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});
export default router;
