import { Request, Response, Router } from "express";
import withdrawService from "./withdraw.service";
import orgsService from "../orgs/orgs.service";
import authMiddleware from "../../../middleware/auth.middleware";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import { config } from "./../../../config/config";
import orderService from "../order/order.service";
import { OrderWithdrawRequestStatus } from "../../../common/constants";

const router = Router();

router.post(
  "/",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyOrg,
  async (request: Request, response: Response) => {
    try {
      const orgId = request["user"].id;
      const { orders } = request.body;
      if (!orders.length) {
        throw "Need at least 1 orders";
      }

      const validOrders = await orderService.getValidOrdersByOrderIdList(
        orders
      );
      const validOrderIdList = validOrders.map(order => order._id);
      if (!validOrderIdList.length) {
        throw "Need at least 1 valid orders";
      }

      const amount = validOrders.reduce((a, b) => a + b.amount, 0);

      const validMinimumAmount = amount >= config.MIN_WITHDRAW_AVAILABLE_AMOUNT;
      if (!validMinimumAmount) {
        throw `Minimum withdrawal amount is ${config.MIN_WITHDRAW_AVAILABLE_AMOUNT.toLocaleString()}`;
      }

      const { withdrawAvailableAmount } = await orgsService.getOrgPgSummary(
        orgId
      );
      const validAmount = amount <= withdrawAvailableAmount;
      if (!validAmount) {
        throw "Cannot create withdrawal due to lack of balance";
      }

      // orders withdrawRequestStatus 변경하기
      await orderService.updateOrdersMany(validOrderIdList, {
        withdrawRequestStatus: OrderWithdrawRequestStatus.REQUESTED
      });

      await withdrawService.createWithdraw({
        orgId,
        amount,
        validOrderIdList
      });

      // renewed pre-request-list
      const withdraw = await withdrawService.getWithdrawPreRequestListByOrgId(
        orgId
      );

      return response.status(200).send({ data: withdraw });
    } catch (error) {
      return response.status(400).send({ error });
    }
  }
);

router.get(
  "/pre-request-list",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyOrg,
  async (request: Request, response: Response) => {
    try {
      const { id: orgId } = request["user"];

      const withdraw = await withdrawService.getWithdrawPreRequestListByOrgId(
        orgId
      );
      return response.status(200).send({ data: withdraw });
    } catch (error) {
      return response.status(400).send({ error });
    }
  }
);

router.get(
  "/post-request-list",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyOrg,
  async (request: Request, response: Response) => {
    try {
      const { id: orgId } = request["user"];

      const withdraw = await withdrawService.getWithdrawListByOrgId(orgId);
      return response.status(200).send({ data: withdraw });
    } catch (error) {
      return response.status(400).send({ error });
    }
  }
);

export default router;
