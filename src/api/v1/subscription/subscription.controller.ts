import { Request, Response, Router } from "express";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import subscriptionService from "./subscription.service";

const router = Router();

router.post(
  "/inactive",
  jwtMiddleware.verifyToken,
  async (request: Request, response: Response) => {
    try {
      const { id } = request.body;
      if (!id) throw "Id is empty";
      const userId = request["user"].id;
      const subscription = await subscriptionService.getSubscriptionOrderById(id);
      if (subscription.userId !== userId) throw "Unauthorized"
      
      const updatedOrder = await subscriptionService.updateSubscriptionOrder(
        id,
        {
          active: false
        }
      );
      return response.status(201).send({ data: updatedOrder });
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
      return response.status(201).send({});
    } catch (error) {
      return response.status(400).send({ error });
    }
  }
);

export default router;
