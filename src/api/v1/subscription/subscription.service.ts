import { SubscriptionModel } from "./schema/subscription.schema";
import { kakaopayRequestSubcriptionPayment } from "../../../utils/kakaopay";
import orderService from "../order/order.service";
import { OrderPaidStatus, OrderPaymentType } from "../../../common/constants";
import KasWallet from "../../../utils/kasWallet";
import authService from "../auth/auth.service";
import userService from "../user/user.service";

const createSubscription = async data => {
  try {
    const sOrder = await SubscriptionModel.create(data);

    return sOrder;
  } catch (error) {
    throw error;
  }
};

const updateSubscription = async (id, updateData) => {
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

const getSubscriptionById = async id => {
  try {
    const order = await SubscriptionModel.findOne({ _id: id });

    return order;
  } catch (error) {
    throw error;
  }
};

const getSubscriptionByDonationId = async id => {
  try {
    const order = await SubscriptionModel.findOne({ donationId: id });

    return order;
  } catch (error) {
    throw error;
  }
};

const getActiveSubscriptions = async () => {
  try {
    const order = await SubscriptionModel.find({ active: true });

    return order;
  } catch (error) {
    throw error;
  }
};

const getActiveSubscriptionsByDate = async date => {
  try {
    const order = await SubscriptionModel.find({
      active: true,
      subscriptionOn: date
    });

    return order;
  } catch (error) {
    throw error;
  }
};

const getActiveSubscriptionTargetIdListByUserId = async userId => {
  try {
    const _order = await SubscriptionModel.find({ userId, active: true })
      .select({ targetId: 1 })
      .lean();

    const order = [...new Set(_order.map(item => item.targetId.toString()))];

    return order;
  } catch (error) {
    throw error;
  }
};

const doPaymentAll = async () => {
  try {
    const subscriptionList = await getActiveSubscriptions();
    subscriptionList.map(async subscription => {
      const {
        _id,
        userId,
        targetType,
        targetId,
        donationId,
        pg,
        amount,
        subscriptionOn,
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
          paymentType: OrderPaymentType.SUBSCRIPTION_PAYMENT,
          // subscriptionOn,
          paidStatus: OrderPaidStatus.APPROVED,
          paidAt: data.approved_at
        });

        // update subscription
        await updateSubscription(_id, {
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

const doPaymentAllOnDate = async date => {
  try {
    if (!date) throw "no date";
    const subscriptionList = await getActiveSubscriptionsByDate(date);
    subscriptionList.map(async subscription => {
      const {
        _id,
        userId,
        targetType,
        targetId,
        donationId,
        pg,
        amount,
        subscriptionOn,
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
          paymentType: OrderPaymentType.SUBSCRIPTION_PAYMENT,
          // subscriptionOn,
          paidStatus: OrderPaidStatus.APPROVED,
          paidAt: data.approved_at
        });

        // update subscription
        await updateSubscription(_id, {
          paidCount: subscription.paidCount + 1,
          lastPaidAt: data.approved_at
        });

        // create nft
        const user = await userService.getUserById(userId.toString());
        const { token_id } = await KasWallet.mintNft(
          order,
          user.wallet.address
        );

        // update nft
        await orderService.updateOrder(order._id, {
          nft: token_id
        });
      }
    });
  } catch (error) {
    throw error;
  }
};

export default {
  createSubscription,
  updateSubscription,
  getSubscriptionById,
  getSubscriptionByDonationId,
  getActiveSubscriptions,
  getActiveSubscriptionTargetIdListByUserId,
  doPaymentAll,
  doPaymentAllOnDate
};
