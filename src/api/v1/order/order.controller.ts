import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { validateBody } from "../../../common/helper/validate.helper";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import orderService from "./order.service";

const router = Router();

/**
   * @swagger
   *  /api/v1/order:
   *    post:
   *      tags:
   *      - orderV1
   *      description: 후원 주문하기
   *      comsumes:
   *      - application/json
   *      parameters:
   *        - name: donationId
   *          in: body
   *          required: true
   *          schema:
   *              type: string
   *              example: "63983aa27edf70db0fa4fc21"
   *          description: 후원 종류 ID
   *      responses:
   *       '201':
   *         description: 성공
   *         examples:
   *            application/json:
   *                {
   *                    "data": {
   *                        "userId": "6397e53dbea9b5b5dbdb7472",
   *                        "donationId": "63983aa27edf70db0fa4fc21",
   *                        "paidStatus": "notyet",
   *                        "_id": "63984df96a8327ab97f70b41",
   *                        "createdAt": "2022-12-13T10:03:37.441Z",
   *                        "updatedAt": "2022-12-13T10:03:37.441Z",
   *                        "__v": 0
   *                    }
   *                }
   */
router.post("/", 
    jwtMiddleware.verifyToken,
    async (request: Request, response: Response) => {
  try {
    const orderData = {
        userId: request["user"].id,
        donationId: request.body.donationId,
        paidStatus: "notyet" 
    }
    const order = await orderService.createOrder(orderData);
    return response.status(201).json({ data: order });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

export default router;
