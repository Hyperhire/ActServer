import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { logger } from "../../../logger/winston.logger";
import { uploadFile } from "../../../utils/upload";

const router = Router();

interface MulterRequest extends Request {
    file: any;
    test: any;
  }

router.post(
  "/upload-image",
  uploadFile('images').single("test"),
  async (request: MulterRequest, response: Response) => {
    try {
      const file = request?.file
      if (!file) {
        throw 'no image';
      }
      return response.status(201).json({ data: {url: file.location} });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

export default router;