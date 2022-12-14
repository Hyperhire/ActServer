import { Request, Router, Response } from "express";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import { kakaopayApprove } from "../../../utils/kakaopay";
import orderService from "./order.service";

const router = Router();


/**
   * @swagger
   *  /api/v1/order/my:
   *    post:
   *      tags:
   *      - orderV1
   *      description: 내 후원 목록 가져오기
   *      comsumes:
   *      - application/json
   *      responses:
   *       '200':
   *         description: 성공
   *         examples:
   *            application/json:
   *                {
   *                    "data": [
   *                        {
   *                            "_id": "63985f883bb683ef88ca00dd",
   *                            "userId": "6397e53dbea9b5b5dbdb7472",
   *                            "donationId": "63983aa27edf70db0fa4fc21",
   *                            "paidStatus": "approved",
   *                            "createdAt": "2022-12-13T11:18:32.475Z",
   *                            "updatedAt": "2022-12-13T11:18:32.475Z",
   *                            "__v": 0,
   *                            "kakaoTID": "T3985f881ce82531c937",
   *                            "donation": {
   *                                "_id": "63983aa27edf70db0fa4fc21",
   *                                "userId": "6397e53dbea9b5b5dbdb7472",
   *                                "type": "org",
   *                                "orgId": "6396bc8fd2df1a7c6cd2a42a",
   *                                "isRecurring": false,
   *                                "amount": 10000,
   *                                "createdAt": "2022-12-13T08:41:06.198Z",
   *                                "updatedAt": "2022-12-13T08:41:06.198Z",
   *                                "__v": 0,
   *                                "name": "일시_10000"
   *                            }
   *                        },
   *                        {
   *                            "_id": "63985e7fb6a9ef5010916605",
   *                            "userId": "6397e53dbea9b5b5dbdb7472",
   *                            "donationId": "63983aa27edf70db0fa4fc21",
   *                            "paidStatus": "approved",
   *                            "createdAt": "2022-12-13T11:14:07.616Z",
   *                            "updatedAt": "2022-12-13T11:14:07.616Z",
   *                            "__v": 0,
   *                            "kakaoTID": "T3985e7f1ce82531c936",
   *                            "donation": {
   *                                "_id": "63983aa27edf70db0fa4fc21",
   *                                "userId": "6397e53dbea9b5b5dbdb7472",
   *                                "type": "org",
   *                                "orgId": "6396bc8fd2df1a7c6cd2a42a",
   *                                "isRecurring": false,
   *                                "amount": 10000,
   *                                "createdAt": "2022-12-13T08:41:06.198Z",
   *                                "updatedAt": "2022-12-13T08:41:06.198Z",
   *                                "__v": 0,
   *                                "name": "일시_10000"
   *                            }
   *                        }
   *                    ]
   *                }
   */
router.get(
  "/my",
  jwtMiddleware.verifyToken,
  async (request: Request, response: Response) => {
    try {
      const orders = await orderService.getMyOrders(request["user"].id);

      return response.status(200).json({
        data: orders
      });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

/**
   * @swagger
   *  /api/v1/order/approve/kakao:
   *    post:
   *      tags:
   *      - orderV1
   *      description: 결제 승인하기
   *      comsumes:
   *      - application/json
   *      parameters:
   *        - name: orderId
   *          in: body
   *          required: true
   *          schema:
   *              type: string
   *              example: "63983aa27edf70db0fa4fc21"
   *          description: 주문 ID
   *        - name: pg_token
   *          in: body
   *          required: true
   *          schema:
   *              type: string
   *              example: "54a319690f80b476ee2b"
   *          description: redirection queryparams로 온 데이터
   *      responses:
   *       '201':
   *         description: 성공
   *         examples:
   *            application/json:
   *                {
   *                    "data": {
   *                            "userId": "6397e53dbea9b5b5dbdb7472",
   *                            "donationId": "63983aa27edf70db0fa4fc21",
   *                            "paidStatus": "approved",
   *                            "_id": "63985618b9c748e2979a880c",
   *                            "createdAt": "2022-12-13T10:38:16.351Z",
   *                            "updatedAt": "2022-12-13T10:38:16.351Z",
   *                            "__v": 0
   *                    }
   *                }
   */
router.post(
  "/approve/kakao",
  jwtMiddleware.verifyToken,
  async (request: Request, response: Response) => {
    try {
      const orderId = request.body.orderId;
      const pg_token = request.body.pg_token;

      const { order, donation } = await orderService.getOrderAndDonation(
        orderId
      );

      await kakaopayApprove(order, donation, pg_token);

      const updatedOrder = await orderService.updateOrder(orderId, {
        paidStatus: "approved"
      });

      //TODO: NFT Creation with information

      return response.status(200).json({ data: updatedOrder });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

export default router;
