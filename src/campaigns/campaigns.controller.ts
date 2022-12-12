import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { validateBody } from "../common/helper/validate.helper";
import { logger } from "../logger/winston.logger";
import campaignsService from "./campaigns.service";
import { CreateCampaignDto } from "./dto/request.dto";
import { CampaignDto, CampaignOrgDto } from "./dto/response.dto";
import jwtMiddleware from "./../middleware/jwt.middleware";
import { IdDto, PaginationDto } from "../common/dto/request.dto";

const router = Router();

router.post(
  "/",
  jwtMiddleware.verifyToken,
  async (request: Request, response: Response) => {
    try {
      request.body.orgId = request["user"].id;
      const createCampaignDto = plainToInstance(
        CreateCampaignDto,
        request.body
      );
      await validateBody<CreateCampaignDto>(createCampaignDto);
      const campaign: CampaignDto = await campaignsService.create(
        createCampaignDto
      );
      return response.status(201).json({ data: campaign });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);
router.get("/", async (request: Request, response: Response) => {
  try {
    const campaigns = await campaignsService.getList();
    return response.status(201).json({ data: campaigns });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

router.get("/:id", async (request: Request, response: Response) => {
  try {
    const campaign = await campaignsService.getCampaignById(request.params.id);
    return response.status(201).json({ data: campaign[0] });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

router.get("/list-by-org/:id", async (request: Request, response: Response) => {
  try {
    // const idDto = plainToInstance(IdDto, request.params)
    // await validateBody<IdDto>(idDto)
    const campaign = await campaignsService.getCampaignByOrgId(
      request.params.id
    );
    return response.status(201).json({ data: campaign });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

export default router;
