import { SubscriptionOrderModel } from "./schema/subscription_order.schema";

const createSubscriptionOrder = async data => {
  console.log("create subscription order,", data);
  try {
    const sOrder = await SubscriptionOrderModel.create(data);

    return sOrder;
  } catch (error) {
    throw error;
  }
};

const updateSubscriptionOrder = async (id, updateData) => {
  try {
    const order = await SubscriptionOrderModel.findOneAndUpdate(
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
    const order = await SubscriptionOrderModel.findOne({ _id: id });

    return order;
  } catch (error) {
    throw error;
  }
};

const getActiveSubscriptionOrders = async () => {
  try {
    const order = await SubscriptionOrderModel.find({ active: true });

    return order;
  } catch (error) {
    throw error;
  }
};

export default {
  createSubscriptionOrder,
  updateSubscriptionOrder,
  getSubscriptionOrderById,
  getActiveSubscriptionOrders
};
