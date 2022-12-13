import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { validateBody } from "../../../common/helper/validate.helper";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import { kakaopayReady, kakaopayApprove } from "../../../utils/kakaopay";
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
   *                        "order": {
   *                            "userId": "6397e53dbea9b5b5dbdb7472",
   *                            "donationId": "63983aa27edf70db0fa4fc21",
   *                            "paidStatus": "notyet",
   *                            "_id": "63985618b9c748e2979a880c",
   *                            "createdAt": "2022-12-13T10:38:16.351Z",
   *                            "updatedAt": "2022-12-13T10:38:16.351Z",
   *                            "__v": 0
   *                        }
   *                    },
   *                    "redirectURLS": {
   *                        "web": "https://online-pay.kakao.com/mockup/v1/8f7ec9090b359d997896a7ff5bd91c8ae3615231e139abed7505e43f2cbe657a/info",
   *                        "mobile": "https://online-pay.kakao.com/mockup/v1/8f7ec9090b359d997896a7ff5bd91c8ae3615231e139abed7505e43f2cbe657a/mInfo"
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
    const {order, donation} = await orderService.createOrder(orderData);
    const kakaopayReadyResult = await kakaopayReady(order, donation);
    await orderService.updateOrder(order._id, { kakaoTID: kakaopayReadyResult.data.tid})
    
    return response.status(201).json({ 
        data: {
            order
        },
        redirectURLS: {
            web: kakaopayReadyResult.data.next_redirect_pc_url,
            mobile: kakaopayReadyResult.data.next_redirect_mobile_url
        }
    });

  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

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
router.post("/approve/kakao", 
    jwtMiddleware.verifyToken,
    async (request: Request, response: Response) => {
  try {
    const orderId = request.body.orderId;
    const pg_token = request.body.pg_token;
    
    const {order, donation} = await orderService.getOrderAndDonation(orderId);
    
    await kakaopayApprove(order, donation, pg_token);
    
    const updatedOrder = await orderService.updateOrder(orderId, { paidStatus: "approved"})

    return response.status(200).json({ data: updatedOrder});

  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

export default router;
