import { Types } from "mongoose";
import { DonationModel } from "../donation/schema/donation.schema";
import orgsService from "../orgs/orgs.service";
import { OrderModel } from "./schema/order.schema";

const createOrder = async orderData => {
  try {
    const newOrder = await OrderModel.create(orderData);

    return newOrder;
  } catch (error) {
    throw error;
  }
};

const updateOrder = async (id, updateData) => {
  try {
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: id },
      { ...updateData, updatedAt: new Date().toISOString() },
      {
        new: true
      }
    );

    return updatedOrder;
  } catch (error) {
    throw error;
  }
};

const getOrderById = async orderId => {
  try {
    const order = await OrderModel.findOne({ _id: orderId });

    return order;
  } catch (error) {
    throw error;
  }
};

const getOrderAndDonation = async orderId => {
  try {
    const order = await OrderModel.findOne({ _id: orderId });

    const donation = await DonationModel.findOne({ _id: "112kljfa" });

    return { order, donation };
  } catch (error) {
    throw error;
  }
};

const getMyOrders = async userId => {
  try {
    const orders = await OrderModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          paidStatus: "approved"
        }
      },
      {
        $lookup: {
          from: "donations",
          localField: "donationId",
          foreignField: "_id",
          as: "donation"
        }
      },
      {
        $unwind: {
          path: "$donation",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);
    return orders;
  } catch (error) {
    throw error;
  }
};

const getOrgInfoByOrder = async order => {
  const { targetType, targetId } = order;
  if (targetType === "ORG") {
    const org = await orgsService.getOrgById(targetId);
    return org;
  }
  return { name: "error company", nftImageUrl: "" };
};

export default {
  createOrder,
  updateOrder,
  getOrderById,
  getOrderAndDonation,
  getMyOrders,
  getOrgInfoByOrder
};
