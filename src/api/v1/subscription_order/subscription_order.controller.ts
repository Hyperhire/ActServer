import { Request, Response, Router } from "express";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import subscription_orderService from "./subscription_order.service";

const router = Router();

router.post(
  "/inactive",
  jwtMiddleware.verifyToken,
  async (request: Request, response: Response) => {
    try {
      const { id } = request.body;
      if (!id) throw "Id is empty";
      const updatedOrder = await subscription_orderService.updateSubscriptionOrder(
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
      const payments = await subscription_orderService.doPaymentAll();
      return response.status(201).send({});
    } catch (error) {
      return response.status(400).send({ error });
    }
  }
);

export default router;
