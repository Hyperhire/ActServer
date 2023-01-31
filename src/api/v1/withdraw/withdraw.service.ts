import mongoose from "mongoose";
import campaignsService from "../campaigns/campaigns.service";
import { WithdrawModel } from "./schema/withdraw.schema";
import { OrderModel } from "../order/schema/order.schema";
import {
    OrderWithdrawRequestStatus,
    WithdrawStatus,
} from "../../../common/constants";
import { logger } from "../../../logger/winston.logger";

const createWithdraw = async (data) => {
    try {
        const withdraw = await WithdrawModel.create(data);
        return withdraw;
    } catch (error) {
        throw error;
    }
};

const updateWithdraw = async (id, updateData) => {
    try {
        const updatedWithdraw = await WithdrawModel.findOneAndUpdate(
            { _id: id },
            { ...updateData, updatedAt: new Date().toISOString() },
            { new: true }
        ).lean();

        return updatedWithdraw;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getWithdrawsByAdmin = async (query) => {
    try {
        const { limit, lastIndex, keyword } = query;
        const pagination = { totalCount: 0, lastIndex: 0, hasNext: true };
        const _limit = 1 * limit || 20;
        const _lastIndex = 1 * lastIndex || 0;
        const searchQuery = {} as any;

        // if (keyword) {
        //     searchQuery["$or"] = [
        //         { title: { $regex: keyword, $options: "i" } },
        //         { description: { $regex: keyword, $options: "i" } },
        //     ];
        // }
        if (query?.status) searchQuery.status = query.status;
        if (query?.from && query?.to) {
            searchQuery.$and = [
                { createdAt: { $gte: query.from } },
                { createdAt: { $lte: query.to } },
            ];
        } else if (query?.from) searchQuery.createdAt = { $gte: query.from };
        else if (query?.to) searchQuery.createdAt = { $gte: query.to };

        const _result = await WithdrawModel.aggregate([
            { $match: searchQuery },
            { $skip: _lastIndex },
            { $limit: _limit },
            {
                $lookup: {
                    from: "orgs",
                    foreignField: "_id",
                    localField: "orgId",
                    as: "org",
                },
            },
            {
                $unwind: "$org",
            },
        ]);

        const totalCount = await WithdrawModel.countDocuments(searchQuery);
        const currentLastIndex = _lastIndex + _result.length;

        pagination.totalCount = totalCount;
        pagination.lastIndex = currentLastIndex;
        pagination.hasNext = totalCount === currentLastIndex ? false : true;

        return {
            pagination,
            list: _result,
        };
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getWithdrawById = async (id) => {
    try {
        const withdraw = await WithdrawModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "orgs",
                    foreignField: "_id",
                    localField: "orgId",
                    as: "org",
                },
            },
            {
                $unwind: "$org",
            },
        ]);

        return withdraw[0];
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getWithdrawPreRequestListByOrgId = async (orgId) => {
    try {
        const orgCampaigns = await campaignsService.getAllCampaignIdsByOrgId(
            orgId
        );
        const amountByStatus = await OrderModel.aggregate([
            {
                $match: {
                    targetId: {
                        $in: [
                            ...orgCampaigns,
                            new mongoose.Types.ObjectId(orgId),
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: "$withdrawRequestStatus",
                    amount: { $sum: "$amount" },
                },
            },
        ]);

        const NOT_YET_AMOUNT =
            (amountByStatus.filter((status) => !status._id)[0]?.amount || 0) +
            (amountByStatus.filter(
                (status) => status._id === OrderWithdrawRequestStatus.NOT_YET
            )[0]?.amount || 0);
        const REQUESTED_AMOUNT =
            amountByStatus.filter(
                (status) => status._id === OrderWithdrawRequestStatus.REQUESTED
            )[0]?.amount || 0;

        const org_order_list = await OrderModel.aggregate([
            {
                $match: {
                    targetId: new mongoose.Types.ObjectId(orgId),
                },
            },
            {
                $lookup: {
                    from: "orgs",
                    foreignField: "_id",
                    localField: "targetId",
                    as: "org",
                },
            },
            { $unwind: "$org" },
            { $sort: { createdAt: -1 } },
        ]);

        const campaign_order_list = await OrderModel.aggregate([
            {
                $match: {
                    targetId: { $in: [...orgCampaigns] },
                },
            },
            {
                $lookup: {
                    from: "campaigns",
                    foreignField: "_id",
                    localField: "targetId",
                    as: "campaign",
                },
            },
            { $unwind: "$campaign" },
            {
                $lookup: {
                    from: "orgs",
                    foreignField: "_id",
                    localField: "campaign.orgId",
                    as: "org",
                },
            },
            { $unwind: "$org" },
            { $sort: { createdAt: -1 } },
        ]);

        const all_list = [...org_order_list, ...campaign_order_list].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );

        const NOT_YET = all_list.filter(
            (order) =>
                !order.withdrawRequestStatus ||
                order.withdrawRequestStatus ===
                    OrderWithdrawRequestStatus.NOT_YET
        );
        const REQUESTED = all_list.filter(
            (order) =>
                order.withdrawRequestStatus ===
                OrderWithdrawRequestStatus.REQUESTED
        );

        return {
            amount: {
                NOT_YET: NOT_YET_AMOUNT,
                REQUESTED: REQUESTED_AMOUNT,
            },
            list: { NOT_YET, REQUESTED },
        };
    } catch (error) {
        throw error;
    }
};

const getWithdrawListByOrgId = async (orgId) => {
    try {
        const res = await WithdrawModel.find({ orgId }).lean();

        const PENDING = res.filter(
            (item) => item.status === WithdrawStatus.PENDING
        );
        const COMPLETE = res.filter(
            (item) => item.status === WithdrawStatus.COMPLETE
        );

        const PENDING_AMOUNT = PENDING.reduce((a, b) => a + b.amount, 0);
        const COMPLETE_AMOUNT = COMPLETE.reduce((a, b) => a + b.amount, 0);

        return {
            amount: {
                PENDING: PENDING_AMOUNT,
                COMPLETE: COMPLETE_AMOUNT,
            },
            list: {
                PENDING,
                COMPLETE,
            },
        };
    } catch (error) {
        throw error;
    }
};

export default {
    createWithdraw,
    updateWithdraw,
    getWithdrawsByAdmin,
    getWithdrawPreRequestListByOrgId,
    getWithdrawListByOrgId,
    getWithdrawById,
};
