import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { validateBody } from "../../../common/helper/validate.helper";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import campaignsService from "./campaigns.service";
import { CreateCampaignDto } from "./dto/request.dto";
import { CampaignDto, CampaignOrgDto } from "./dto/response.dto";
import { UserType } from "./../../../common/constants";
import authMiddleware from "../../../middleware/auth.middleware";
import donationService from "../donation/donation.service";
import { uploadFileToS3 } from "../../../utils/upload";

interface MulterRequest extends Request {
  files: any;
}

const router = Router();

router.post(
  "/",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyOrg,
  uploadFileToS3("campaigns").array("images"),
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

      const createData = {
        ..._data,
        images: request.files.map(file => file.location),
        orgId: id
      };

      // const createCampaignDto = plainToInstance(CreateCampaignDto, data);
      // await validateBody<CreateCampaignDto>(createCampaignDto);

      const campaign: CampaignDto = await campaignsService.create(createData);

      return response.status(201).json({ data: campaign });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

router.get(
  "/",
  jwtMiddleware.verifyTokenWhenExists,
  async (request: Request, response: Response) => {
    try {
      const { id, userType } = request["user"];
      const query = request.query;
      const { pagination, list: _list } = await campaignsService.getList(query);

      let campaignDonations = [];
      if (id && userType === UserType.INDIVIDUAL) {
        campaignDonations = await donationService.getCampaignDonationsByUserId(
          id
        );
      }

      const list = [];
      _list.forEach((_campaign: any) =>
        list.push({
          ..._campaign,
          isDonating: campaignDonations.indexOf(_campaign._id.toString()) > -1
        })
      );

      return response.status(200).json({
        data: {
          pagination,
          list
        }
      });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

router.get(
  "/:id",
  jwtMiddleware.verifyTokenWhenExists,
  async (request: Request, response: Response) => {
    try {
      const { id, userType } = request["user"];
      const campaign = await campaignsService.getCampaignById(
        request.params.id
      );

      let campaignDonations = [];
      if (id && userType === UserType.INDIVIDUAL) {
        campaignDonations = await donationService.getCampaignDonationsByUserId(
          id
        );
      }

      return response.status(200).json({
        data: {
          ...campaign,
          isDonating: campaignDonations.indexOf(campaign._id.toString()) > -1
        }
      });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

router.get(
  "/list-by-org/:id",
  jwtMiddleware.verifyTokenWhenExists,
  async (request: Request, response: Response) => {
    try {
      const { id, userType } = request["user"];
      const campaign = await campaignsService.getActiveCampaignsByOrgId(
        request.params.id
      );

      let campaignDonations = [];
      if (id && userType === UserType.INDIVIDUAL) {
        campaignDonations = await donationService.getCampaignDonationsByUserId(
          id
        );
      }

      const result = [];
      campaign.forEach((_campaign: any) =>
        result.push({
          ..._campaign,
          isDonating: campaignDonations.indexOf(_campaign._id.toString()) > -1
        })
      );

      return response.status(200).json({ data: result });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

export default router;
