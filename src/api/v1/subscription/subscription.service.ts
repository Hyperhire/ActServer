import { SubscriptionModel } from "./schema/subscription.schema";
import { kakaopayRequestSubcriptionPayment } from "../../../utils/kakaopay";
import orderService from "../order/order.service";
import { OrderPaidStatus } from "../../../common/constants";
import KasWallet from "../../../utils/kasWallet";
import authService from "../auth/auth.service";
import userService from "../user/user.service";

const createSubscriptionOrder = async data => {
  try {
    const sOrder = await SubscriptionModel.create(data);

    return sOrder;
  } catch (error) {
    throw error;
  }
};

const updateSubscriptionOrder = async (id, updateData) => {
  try {
    const order = await SubscriptionModel.findOneAndUpdate(
      { _id: id },
      { ...updateData, updatedAt: new Date().toISOString() },
      {
        new: true
      }
    );

    return order;
  } catch (error) {
    throw error;
  }
};

const getSubscriptionOrderById = async id => {
  try {
    const order = await SubscriptionModel.findOne({ _id: id });

    return order;
  } catch (error) {
    throw error;
  }
};

const getActiveSubscriptionOrders = async () => {
  try {
    const order = await SubscriptionModel.find({ active: true });

    return order;
  } catch (error) {
    throw error;
  }
};

const doPaymentAll = async () => {
  try {
    const subscriptionList = await getActiveSubscriptionOrders();
    subscriptionList.map(async subscription => {
      // console.log("order 121", order);
      const {
        _id,
        userId,
        targetType,
        targetId,
        donationId,
        pg,
        amount,
        kakaoSID
      } = subscription;
      const { status, data } = await kakaopayRequestSubcriptionPayment(
        subscription
      );
      if (status === 200) {
        // create order
        const order = await orderService.createOrder({
          userId,
          targetType,
          targetId,
          pg,
          amount,
          donationId,
          kakaoSID,
          paidStatus: OrderPaidStatus.APPROVED,
          paidAt: data.approved_at
        });

        // update subscription
        await updateSubscriptionOrder(_id, {
          paidCount: subscription.paidCount + 1,
          lastPaidAt: data.approved_at
        });

        // create nft
        const user = await userService.getUserById(userId.toString());
        const res = await KasWallet.mintNft(order, user.wallet.address);

        // update nft
        await orderService.updateOrder(order._id, {
          nft: res.token_id
        });
      }
    });
  } catch (error) {
    throw error;
  }
};

export default {
  createSubscriptionOrder,
  updateSubscriptionOrder,
  getSubscriptionOrderById,
  getActiveSubscriptionOrders,
  doPaymentAll
};