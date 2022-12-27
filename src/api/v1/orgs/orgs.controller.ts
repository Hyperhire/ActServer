import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { UserType } from "../../../common/constants";
import { IdDto } from "../../../common/dto/request.dto";
import { validateBody } from "../../../common/helper/validate.helper";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import { uploadFile } from "../../../utils/upload";
import donationService from "../donation/donation.service";
import { BaseOrgDto } from "./dto/request.dto";
import orgsService from "./orgs.service";

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
        const _orgDonations = await donationService.getOrgDonationsByUserId(id);
        orgDonations = [
          ...new Set(_orgDonations.map(item => item.targetId.toString()))
        ];
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
router.get("/:id", async (request: Request, response: Response) => {
  try {
    const idDto = plainToInstance(IdDto, request.params);
    await validateBody<IdDto>(idDto);
    const org = await orgsService.getOrgById(idDto.id);
    return response.status(200).json({ data: org });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

export default router;
