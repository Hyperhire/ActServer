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
/**
   * @swagger
   *  /api/v1/donation:
   *    post:
   *      tags:
   *      - donationV1
   *      description: 후원하기
   *      comsumes:
   *      - application/json
   *      parameters:
   *        - name: type
   *          in: body
   *          required: true
   *          schema:
   *              type: string
   *              example: "org"
   *          description: 기관, 캠페인 중 하나
   *        - name: orgId
   *          in: body
   *          required: false
   *          schema:
   *              type: string
   *              example: "63983aa27edf70db0fa4fc21"
   *          description: type을 기관으로 선택했다면 해당 ID
   *        - name: campaignId
   *          in: body
   *          required: false
   *          schema:
   *              type: string
   *              example: "63983aa27edf70db0fa4fc21"
   *          description: type을 캠페인으로 선택했다면 해당 ID
   *        - name: isRecurring
   *          in: body
   *          required: true
   *          schema:
   *              type: boolean
   *              example: "truee"
   *          description: type을 캠페인으로 선택했다면 해당 ID
   *        - name: method
   *          in: body
   *          required: true
   *          schema:
   *              type: string
   *              example: "kakao"
   *          description: 결제 방식
   *        - name: amount
   *          in: body
   *          required: true
   *          schema:
   *              type: number
   *          description: 금액
   *      responses:
   *       '201':
   *         description: 성공
   *         examples:
   *            application/json:
   *                {
   *                    "data": {
   *                        "userId": "6397e53dbea9b5b5dbdb7472",
   *                        "type": "org",
   *                        "orgId": "6396bc8fd2df1a7c6cd2a42a",
   *                        "method": "kakao",
   *                        "isRecurring": false,
   *                        "recurringOn": "1",
   *                        "amount": 10000,
   *                        "_id": "63995e98bd61d8d7fd43a939",
   *                        "createdAt": "2022-12-14T05:26:48.818Z",
   *                        "updatedAt": "2022-12-14T05:26:48.818Z",
   *                        "__v": 0
   *                    }
   *                }
   */
router.post("/", 
    jwtMiddleware.verifyToken,
    async (request: Request, response: Response) => {
  try {
    const donationDTO = plainToInstance(CreateDonationDTO, request.body);
    await validateBody<CreateDonationDTO>(donationDTO);
    const donationData = {
        userId: request["user"].id,
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
