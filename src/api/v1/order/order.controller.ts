import { Request, Router, Response } from "express";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import { kakaopayApprove, kakaopayReady } from "../../../utils/kakaopay";
import orderService from "./order.service";
import KasWallet from "./../../../utils/kasWallet";
import userService from "../user/user.service";
import donationService from "../donation/donation.service";
import {
  OrderPaidStatus,
  OrderPaymentType,
  OrderType,
  UserType
} from "./../../../common/constants";
import subscriptionService from "../subscription/subscription.service";
import authMiddleware from "../../../middleware/auth.middleware";
import campaignsService from "../campaigns/campaigns.service";

const router = Router();

router.post(
  "/",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyUser,
  async (request: Request, response: Response) => {
    try {
      const userId = request["user"].id;
      const order = await orderService.createOrder({ userId, ...request.body });

      // TODO: NAVER PG 분기 태우기
      const kakaopayReadyResult = await kakaopayReady(order);
      await orderService.updateOrder(order._id, {
        kakaoTID: kakaopayReadyResult.data.tid
      });

      return response.status(201).json({
        data: {
          order,
          redirectURLS: {
            web: kakaopayReadyResult.data.next_redirect_pc_url,
            mobile: kakaopayReadyResult.data.next_redirect_mobile_url
          }
        }
      });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

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

router.post(
  "/complete",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyUser,
  async (request: Request, response: Response) => {
    try {
      const orderId = request.body.id;
      const userId = request["user"].id;

      const user = await userService.getUserById(userId);
      const order = await orderService.getOrderById(orderId);
      // Approve Kakao PG
      const pg_token = request.body.pg_token;
      const kakaopayApproveResult = await kakaopayApprove(order, pg_token);

      const res = await KasWallet.mintNft(order, user.wallet.address);

      // Update NFT to order
      const updateInfo: any = {
        paidStatus: OrderPaidStatus.APPROVED,
        paidAt: new Date().toISOString(),
        nft: res.token_id
      };
      if (order.paymentType === OrderPaymentType.SUBSCRIPTION_PAYMENT) {
        updateInfo.kakaoSID = kakaopayApproveResult.data.sid;
      }

      // input NFT receipt to order
      const receiptAddedOrder = await orderService.updateOrder(
        orderId,
        updateInfo
      );
      // create Donation
      const { targetType, targetId, pg, amount, paidAt } = receiptAddedOrder;
      const donation = await donationService.createDonation({
        userId,
        targetType,
        targetId,
        pg,
        amount,
        startedAt: paidAt
      });

      // input NFT receipt to order
      const updateParentsInfo: any = { donationId: donation._id };

      if (order.paymentType === OrderPaymentType.SUBSCRIPTION_PAYMENT) {
        // if order is subscription payment, create subscription order for next time
        const sOrder = await subscriptionService.createSubscriptionOrder({
          userId,
          targetType,
          targetId,
          donationId: donation._id,
          subscriptionOn: receiptAddedOrder.subscriptionOn,
          pg,
          amount,
          kakaoSID: receiptAddedOrder.kakaoSID,
          lastPaidAt: paidAt
        });

        // if order is subscription, update on order also
        updateParentsInfo.subscriptionOrderId = sOrder._id;
      }

      // order의 target이 campaign인 경우, campaign의 amount를 increase해줌. 이 데이터는 민감하지 않아보여서 여기에다가만 해도 될 듯
      if (order.targetType === OrderType.CAMPAIGN) {
        const {
          currentAmount,
          donorList
        } = await campaignsService.getCampaignById(targetId);

        const newList = [
          ...new Set([...donorList, userId].map(item => item.toString()))
        ];

        await campaignsService.update(order.targetId, {
          currentAmount: currentAmount + order.amount,
          donorList: newList,
          numberOfDonor: newList.length
        });
      }

      await orderService.updateOrder(orderId, updateParentsInfo);

      return response.status(200).json({ data: donation });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

router.post(
  "/canceled",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyUser,
  async (request: Request, response: Response) => {
    try {
      const orderId = request.body.id;

      const updatedOrder = await orderService.updateOrder(orderId, {
        status: OrderPaidStatus.CANCEL
      });

      return response.status(200).json({ data: updatedOrder });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

router.post(
  "/failed",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyUser,
  async (request: Request, response: Response) => {
    try {
      const orderId = request.body.id;

      const updatedOrder = await orderService.updateOrder(orderId, {
        status: OrderPaidStatus.FAIL
      });

      return response.status(200).json({ data: updatedOrder });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

export default router;
