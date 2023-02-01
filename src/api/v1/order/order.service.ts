import { Types } from "mongoose";
import { DonationModel } from "../donation/schema/donation.schema";
import orgsService from "../orgs/orgs.service";
import { OrderModel } from "./schema/order.schema";
import {
    OrderPaidStatus,
    OrderType,
    OrderWithdrawRequestStatus,
} from "./../../../common/constants";
import campaignsService from "../campaigns/campaigns.service";

const createOrder = async (orderData) => {
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
                new: true,
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

const getOrderById = async (id) => {
    try {
        const orders = await OrderModel.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "donations",
                    localField: "donationId",
                    foreignField: "_id",
                    as: "donation",
                },
            },
            {
                $unwind: {
                    path: "$donation",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        return orders[0];
    } catch (error) {
        throw error;
    }
};

const getOrderByIdByAdmin = async (id) => {
    try {
        const orders = await OrderModel.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "campaigns",
                    localField: "targetId",
                    foreignField: "_id",
                    as: "campaign",
                },
            },
            {
                $unwind: {
                    path: "$campaign",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "orgs",
                    localField: "targetId",
                    foreignField: "_id",
                    as: "orgA",
                },
            },
            {
                $lookup: {
                    from: "orgs",
                    localField: "campaign.orgId",
                    foreignField: "_id",
                    as: "orgB",
                },
            },
            {
                $addFields: {
                    org: {
                        $setUnion: ["$orgA", "$orgB"],
                    },
                },
            },
            {
                $unwind: {
                    path: "$org",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    orgA: 0,
                    orgB: 0,
                },
            },
            {
                $lookup: {
                    from: "donations",
                    localField: "donationId",
                    foreignField: "_id",
                    as: "donation",
                },
            },
            {
                $unwind: {
                    path: "$donation",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        return orders[0];
    } catch (error) {
        throw error;
    }
};

const getOrdersByAdmin = async (query) => {
    try {
        const { limit, lastIndex, keyword } = query;
        const pagination = { totalCount: 0, lastIndex: 0, hasNext: true };
        const _limit = 1 * limit || 20;
        const _lastIndex = 1 * lastIndex || 0;
        const searchQuery = {} as any;

        if (keyword) {
            searchQuery["$or"] = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }
        if (query?.status) searchQuery.status = query.status;
        if (query?.from && query?.to) {
            searchQuery.$and = [
                { createdAt: { $gte: query.from } },
                { createdAt: { $lte: query.to } },
            ];
        } else if (query?.from) searchQuery.createdAt = { $gte: query.from };
        else if (query?.to) searchQuery.createdAt = { $gte: query.to };

        const _result = await OrderModel.aggregate([
            { $match: searchQuery },
            { $skip: _lastIndex },
            { $limit: _limit },
            {
                $lookup: {
                    from: "campaigns",
                    localField: "targetId",
                    foreignField: "_id",
                    as: "campaign",
                },
            },
            {
                $unwind: {
                    path: "$campaign",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "orgs",
                    localField: "targetId",
                    foreignField: "_id",
                    as: "orgA",
                },
            },
            {
                $lookup: {
                    from: "orgs",
                    localField: "campaign.orgId",
                    foreignField: "_id",
                    as: "orgB",
                },
            },
            {
                $addFields: {
                    org: {
                        $setUnion: ["$orgA", "$orgB"],
                    },
                },
            },
            {
                $unwind: {
                    path: "$org",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    orgA: 0,
                    orgB: 0,
                },
            },
            {
                $lookup: {
                    from: "donations",
                    localField: "donationId",
                    foreignField: "_id",
                    as: "donation",
                },
            },
            {
                $unwind: {
                    path: "$donation",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);

        const totalCount = await OrderModel.countDocuments(searchQuery);
        const currentLastIndex = _lastIndex + _result.length;

        pagination.totalCount = totalCount;
        pagination.lastIndex = currentLastIndex;
        pagination.hasNext = totalCount === currentLastIndex ? false : true;

        return {
            pagination,
            list: _result,
        };
    } catch (error) {
        throw error;
    }
};

const getMyOrders = async (userId) => {
    try {
        const orders = await OrderModel.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    paidStatus: OrderPaidStatus.APPROVED,
                },
            },
            {
                $lookup: {
                    from: "donations",
                    localField: "donationId",
                    foreignField: "_id",
                    as: "donation",
                },
            },
            {
                $unwind: {
                    path: "$donation",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        return orders;
    } catch (error) {
        throw error;
    }
};

const getOrgInfoByOrder = async (order) => {
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

const getOrdersByOrderIdList = async (orders) => {
    try {
        const _orders = await OrderModel.aggregate([
            {
                $match: {
                    _id: { $in: orders.map((order) => order.toString()) },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        return _orders;
    } catch (error) {
        throw error;
    }
};

const getValidOrdersByOrderIdList = async (orders) => {
    try {
        const _orders = await OrderModel.aggregate([
            {
                $match: {
                    _id: {
                        $in: orders.map((order) => new Types.ObjectId(order)),
                    },
                    $or: [
                        { withdrawRequestStatus: { $exists: false } },
                        {
                            withdrawRequestStatus:
                                OrderWithdrawRequestStatus.NOT_YET,
                        },
                    ],
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
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
    getOrdersByAdmin,
    getOrderById,
    getOrderByIdByAdmin,
    getMyOrders,
    getOrgInfoByOrder,
    getOrdersByOrderIdList,
    getValidOrdersByOrderIdList,
};
