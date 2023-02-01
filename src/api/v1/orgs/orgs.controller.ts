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
/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: 기부 단체 조회
 */

// create org
router.post("/", async (request: Request, response: Response) => {
  try {
    // const orgs: Array<BaseOrgDto> = await orgsService.getList(paginationDto)
    const newOrg = await orgsService.createOrg(request.body);
    return response.status(201).json({ data: newOrg });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

router.post(
  "/edit-my-org-detail",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyOrg,
  uploadFileToS3("images").fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 3 }
  ]),
  async (request: MulterRequest, response: Response) => {
    try {
      const { id } = request["user"];

      const files = request.files;

      const { data } = request.body;
      if (!data) {
        throw "no Data";
      }
      
      const updateData = {
        ...JSON.parse(data)
      };

      if (files.logo.length) {
        updateData.logoURL = files.logo[0].location
      }
      if (files.images) {
        updateData.imageUrls = files.images.map(file => file.location)
      }

      const updatedOrg = await orgsService.updateOrg(id, updateData);
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
  jwtMiddleware.verifyTokenWhenExists,
  async (request: Request, response: Response) => {
    try {
      const { id, userType } = request["user"];
      const query = request.query;
      const { pagination, list: _list } = await orgsService.getList(query);

      let orgDonations = [];
      if (id && userType === UserType.INDIVIDUAL) {
        orgDonations = await subscriptionService.getActiveSubscriptionTargetIdListByUserId(
          id
        );
      }

      const list = [];
      _list.forEach((org: any) =>
        list.push({
          ...org,
          isDonating: orgDonations.indexOf(org._id.toString()) > -1
        })
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
  jwtMiddleware.verifyTokenWhenExists,
  async (request: Request, response: Response) => {
    try {
      const { id, userType } = request["user"];
      const idDto = plainToInstance(IdDto, request.params);
      await validateBody<IdDto>(idDto);
      const org = await orgsService.getOrgById(idDto.id);

      let orgDonations = [];
      if (id && userType === UserType.INDIVIDUAL) {
        orgDonations = await subscriptionService.getActiveSubscriptionTargetIdListByUserId(
          id
        );
      }

      return response.status(200).json({
        data: { ...org, isDonating: orgDonations.indexOf(idDto.id) > -1 }
      });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

export default router;
