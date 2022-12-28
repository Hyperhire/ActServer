import { Request, Response, Router } from "express";
import authMiddleware from "../../../middleware/auth.middleware";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import { kakaopayRequestInactiveSubscriptionBySid } from "../../../utils/kakaopay";
import subscriptionService from "./subscription.service";

const router = Router();

router.post(
  "/inactive",
  jwtMiddleware.verifyToken,
  authMiddleware.validOnlyUser,
  async (request: Request, response: Response) => {
    try {
      const { id } = request.body;
      if (!id) throw "Id is empty";
      const userId = request["user"].id;

      const subscription = await subscriptionService.getSubscriptionByDonationId(
        id
      );

      if (subscription.userId.toString() !== userId) throw "Unauthorized";

      const kakaoResponse = await kakaopayRequestInactiveSubscriptionBySid(
        subscription.kakaoSID
      );

      const updatedSubscription = await subscriptionService.updateSubscription(
        subscription._id,
        {
          active: false,
          inactiveAt: kakaoResponse.data.inactivated_at
        }
      );
      return response.status(200).send({ data: updatedSubscription });
    } catch (error) {
      return response.status(400).send({ error });
    }
  }
);

router.post(
  "/do-payment-all",
  jwtMiddleware.verifyToken,
  async (request: Request, response: Response) => {
    try {
      const payments = await subscriptionService.doPaymentAll();
      return response.status(200).send({});
    } catch (error) {
      return response.status(400).send({ error });
    }
  }
);

export default router;
