import { Request, Response, Router } from "express";
import withdrawService from "./withdraw.service";
import orgsService from "../orgs/orgs.service";
import authMiddleware from "../../../middleware/auth.middleware";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import { config } from "./../../../config/config";

const router = Router();

router.post(
  "/",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyOrg,
  async (request: Request, response: Response) => {
    try {
      const orgId = request["user"].id;
      const { amount } = request.body;
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

      const withdraw = await withdrawService.createWithdraw({
        orgId,
        amount
      });
      return response.status(200).send({ data: withdraw });
    } catch (error) {
      return response.status(400).send({ error });
    }
  }
);

export default router;
