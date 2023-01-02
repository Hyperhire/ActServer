import { Types } from "mongoose";
import { DonationModel } from "../donation/schema/donation.schema";
import orgsService from "../orgs/orgs.service";
import { OrderModel } from "./schema/order.schema";
import { OrderPaidStatus, OrderType } from "./../../../common/constants";
import campaignsService from "../campaigns/campaigns.service";

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

const updateOrdersMany = async (ids, updateData) => {
  try {
    const updatedOrder = await OrderModel.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
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

const getMyOrders = async userId => {
  try {
    const orders = await OrderModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          paidStatus: OrderPaidStatus.APPROVED
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
  try {
    const { targetType, targetId } = order;

    if (targetType === OrderType.ORGANIZATION) {
      const org = await orgsService.getOrgById(targetId);
      return org;
    } else if (targetType === OrderType.CAMPAIGN) {
      const { orgId } = await campaignsService.getCampaignById(targetId);
      const org = await orgsService.getOrgById(orgId);
      return org;
    }

    throw "Invalid order targetType";
  } catch (error) {
    throw error;
  }
};

const getOrdersByOrderIdList = async orders => {
  try {
    const _orders = await OrderModel.aggregate([
      {
        $match: {
          _id: { $in: orders.map(order => order.toString()) }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);
    return _orders;
  } catch (error) {
    throw error;
  }
};

export default {
  createOrder,
  updateOrder,
  updateOrdersMany,
  getOrderById,
  getMyOrders,
  getOrgInfoByOrder,
  getOrdersByOrderIdList
};
