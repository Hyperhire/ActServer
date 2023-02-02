import mongoose from "mongoose";
import { OrderType } from "../../../common/constants";
import { DonationModel } from "./schema/donation.schema";
import campaignsService from "../campaigns/campaigns.service";

const createDonation = async (donationData) => {
    try {
        const newDonation = await DonationModel.create(donationData);
        return newDonation;
    } catch (error) {
        throw error;
    }
};

const updateDonation = async (id, updateData) => {
    try {
        const newDonation = await DonationModel.findOneAndUpdate(
            { _id: id },
            { ...updateData, updatedAt: new Date().toISOString() },
            {
                new: true,
            }
        );
        return newDonation;
    } catch (error) {
        throw error;
    }
};

const getOrgDonationsByAdmin = async (query) => {
    try {
        const { limit, lastIndex, keyword } = query;
        const pagination = { totalCount: 0, lastIndex: 0, hasNext: true };
        const _limit = 1 * limit || 20;
        const _lastIndex = 1 * lastIndex || 0;
        const searchQuery = { targetType: OrderType.ORGANIZATION } as any;

        if (keyword) {
            searchQuery["$or"] = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }
        if (query?.paymentType) searchQuery.paymentType = query.paymentType;
        if (query?.active === "true" || query?.active === "false")
            searchQuery.active = query.active === "true";
        if (query?.from && query?.to) {
            searchQuery.$and = [
                { createdAt: { $gte: new Date(query.from) } },
                { createdAt: { $lte: new Date(query.to) } },
            ];
        } else if (query?.from)
            searchQuery.createdAt = { $gte: new Date(query.from) };
        else if (query?.to)
            searchQuery.createdAt = { $gte: new Date(query.to) };

        const _result = await DonationModel.aggregate([
            { $match: searchQuery },
            { $sort: { createdAt: -1 } },
            { $skip: _lastIndex },
            { $limit: _limit },
            {
                $lookup: {
                    from: "orgs",
                    foreignField: "_id",
                    localField: "targetId",
                    as: "org",
                },
            },
            {
                $lookup: {
                    from: "orders",
                    foreignField: "donationId",
                    localField: "_id",
                    as: "orders",
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
            { $unwind: "$org" },
        ]);

        const totalCount = await DonationModel.countDocuments(searchQuery);
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

const getCampaignDonationsByAdmin = async (query) => {
    try {
        const { limit, lastIndex, keyword } = query;
        const pagination = { totalCount: 0, lastIndex: 0, hasNext: true };
        const _limit = 1 * limit || 20;
        const _lastIndex = 1 * lastIndex || 0;
        const searchQuery = { targetType: OrderType.CAMPAIGN } as any;

        if (keyword) {
            searchQuery["$or"] = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }
        if (query?.paymentType) searchQuery.paymentType = query.paymentType;
        if (query?.active === "true" || query?.active === "false")
            searchQuery.active = query.active === "true";
        if (query?.from && query?.to) {
            searchQuery.$and = [
                { createdAt: { $gte: new Date(query.from) } },
                { createdAt: { $lte: new Date(query.to) } },
            ];
        } else if (query?.from)
            searchQuery.createdAt = { $gte: new Date(query.from) };
        else if (query?.to)
            searchQuery.createdAt = { $gte: new Date(query.to) };

        const _result = await DonationModel.aggregate([
            { $match: searchQuery },
            { $sort: { createdAt: -1 } },
            { $skip: _lastIndex },
            { $limit: _limit },
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
            {
                $lookup: {
                    from: "orders",
                    foreignField: "donationId",
                    localField: "_id",
                    as: "orders",
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
            { $unwind: "$org" },
        ]);

        const totalCount = await DonationModel.countDocuments(searchQuery);
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

const getOrgDonationByIdByAdmin = async (id) => {
    try {
        const donations = await DonationModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "orgs",
                    foreignField: "_id",
                    localField: "targetId",
                    as: "org",
                },
            },
            {
                $lookup: {
                    from: "orders",
                    foreignField: "donationId",
                    localField: "_id",
                    as: "orders",
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
            { $unwind: "$org" },
        ]);
        return donations[0];
    } catch (error) {
        throw error;
    }
};
const getCampaignDonationByIdByAdmin = async (id) => {
    try {
        const donations = await DonationModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
            {
                $lookup: {
                    from: "orders",
                    foreignField: "donationId",
                    localField: "_id",
                    as: "orders",
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
            { $unwind: "$org" },
        ]);

        return donations[0];
    } catch (error) {
        throw error;
    }
};

const getMyIndDonation = async (userId) => {
    try {
        const orgDonations = await DonationModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    targetType: OrderType.ORGANIZATION,
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
            {
                $lookup: {
                    from: "orders",
                    foreignField: "donationId",
                    localField: "_id",
                    as: "orders",
                },
            },
            { $unwind: "$org" },
            { $sort: { createdAt: -1 } },
        ]);
        const campaignDonations = await DonationModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    targetType: OrderType.CAMPAIGN,
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
            {
                $lookup: {
                    from: "orders",
                    foreignField: "donationId",
                    localField: "_id",
                    as: "orders",
                },
            },
            { $unwind: "$org" },
            { $sort: { createdAt: -1 } },
        ]);
        return {
            orgs: orgDonations,
            campaigns: campaignDonations,
        };
    } catch (error) {
        throw error;
    }
};

const getMyOrgDonation = async (orgId) => {
    try {
        const orgDonations = await DonationModel.aggregate([
            {
                $match: {
                    targetId: new mongoose.Types.ObjectId(orgId),
                    targetType: OrderType.ORGANIZATION,
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
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "userId",
                    as: "user",
                },
            },
            {
                $lookup: {
                    from: "orders",
                    foreignField: "donationId",
                    localField: "_id",
                    as: "orders",
                },
            },
            { $unwind: "$org" },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    targetType: 1,
                    targetId: 1,
                    pg: 1,
                    paymentType: 1,
                    subscriptionOn: 1,
                    amount: 1,
                    active: 1,
                    startedAt: 1,
                    inactivatedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    orders: 1,
                    org: { name: 1 },
                    user: { nickname: 1 },
                },
            },
            { $sort: { createdAt: -1 } },
        ]);

        const campaignList = await campaignsService.getAllCampaignIdsByOrgId(
            orgId
        );

        const campaignDonations = await DonationModel.aggregate([
            {
                $match: {
                    targetId: { $in: campaignList },
                    targetType: OrderType.CAMPAIGN,
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
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "userId",
                    as: "user",
                },
            },
            {
                $lookup: {
                    from: "orders",
                    foreignField: "donationId",
                    localField: "_id",
                    as: "orders",
                },
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    targetType: 1,
                    targetId: 1,
                    pg: 1,
                    paymentType: 1,
                    subscriptionOn: 1,
                    amount: 1,
                    active: 1,
                    startedAt: 1,
                    inactivatedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    orders: 1,
                    campaign: {
                        title: 1,
                        description: 1,
                    },
                    org: { name: 1 },
                    user: { nickname: 1 },
                },
            },
            { $unwind: "$org" },
            { $unwind: "$user" },
            { $sort: { createdAt: -1 } },
        ]);

        return {
            orgs: orgDonations,
            campaigns: campaignDonations,
        };
    } catch (error) {
        throw error;
    }
};

const getOrgDonationsByUserId = async (userId) => {
    try {
        const list = await DonationModel.find({
            userId: new mongoose.Types.ObjectId(userId),
            targetType: OrderType.ORGANIZATION,
        })
            .select({ targetId: 1 })
            .lean();

        return list;
    } catch (error) {
        throw error;
    }
};

const getCampaignDonationsByUserId = async (userId) => {
    try {
        const list = await DonationModel.find({
            userId: new mongoose.Types.ObjectId(userId),
            targetType: OrderType.CAMPAIGN,
        })
            .select({ targetId: 1 })
            .lean();

        return list;
    } catch (error) {
        throw error;
    }
};

export default {
    createDonation,
    updateDonation,
    getOrgDonationsByAdmin,
    getCampaignDonationsByAdmin,
    getOrgDonationByIdByAdmin,
    getCampaignDonationByIdByAdmin,
    getMyIndDonation,
    getMyOrgDonation,
    getOrgDonationsByUserId,
    getCampaignDonationsByUserId,
};
