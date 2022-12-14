import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { validateBody } from "../../../common/helper/validate.helper";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import donationService from "./donation.service";
import { CreateDonationDTO } from "./dto/create-donation.dto";

const router = Router();

// 만드는건 어드민에서나 필요할듯해서 일단 swagger 작성 안함.
// :TODO need to restrict can make only admin(verify the user type)
router.post("/", 
    jwtMiddleware.verifyToken,
    async (request: Request, response: Response) => {
  try {
    const donationDTO = plainToInstance(CreateDonationDTO, request.body);
    await validateBody<CreateDonationDTO>(donationDTO);
    const donationData = {
        ...request.body
    }
    const donation = await donationService.createDonation(donationData);
    return response.status(201).json({ data: donation });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});


/**
   * @swagger
   *  /api/v1/donation/my:
   *    get:
   *      tags:
   *      - donationV1
   *      description: 내 모든 후원 보기
   *      comsumes:
   *      - application/json
   *      responses:
   *       '200':
   *         description: 성공
   */
router.get("/my", 
    jwtMiddleware.verifyToken,
    async (request: Request, response: Response) => {
  try {
    const donations = await donationService.getMy(request["user"].id);
    
    return response.status(200).json({ data: donations });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

export default router;
