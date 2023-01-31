import mongoose from "mongoose";
import { CreateCampaignDto } from "./dto/request.dto";
import { CampaignModel } from "./schema/campaign.schema";
import { PostStatus } from "./../../../common/constants";

const create = async (campaignDto: CreateCampaignDto): Promise<any> => {
    try {
        const camapign = await CampaignModel.create(campaignDto);
        return camapign;
    } catch (error) {
        throw error;
    }
};

const update = async (id, updateData) => {
    try {
        const camapign = await CampaignModel.findOneAndUpdate(
            { _id: id },
            { ...updateData, updatedAt: new Date().toISOString() },
            { new: true }
        ).lean();
        return camapign;
    } catch (error) {
        throw error;
    }
};

const getList = async (query) => {
    try {
        const now = new Date();
        const { limit, lastIndex, keyword } = query;
        const pagination = { totalCount: 0, lastIndex: 0, hasNext: true };
        const _limit = 1 * limit || 20;
        const _lastIndex = 1 * lastIndex || 0;
        const searchQuery = {
            status: PostStatus.APPROVED,
            startedAt: { $lte: now },
            endedAt: { $gte: now },
        };

        if (keyword) {
            searchQuery["$or"] = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }

        const _result = await CampaignModel.aggregate([
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

        const totalCount = await CampaignModel.countDocuments(searchQuery);
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

const getListByAdmin = async (query) => {
    try {
        const now = new Date();
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

        const _result = await CampaignModel.aggregate([
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

        const totalCount = await CampaignModel.countDocuments(searchQuery);
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

const getCampaignById = async (campaignId) => {
    try {
        const now = new Date();
        const campaign = await CampaignModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(campaignId),
                    startedAt: { $lte: now },
                    endedAt: { $gte: now },
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
        return campaign[0];
    } catch (error) {
        throw error;
    }
};

const getAllCampaignIdsByOrgId = async (orgId) => {
    try {
        const campaign = (
            await CampaignModel.find({ orgId })
                .select({
                    _id: 1,
                })
                .lean()
        ).map((item) => item._id);
        return campaign;
    } catch (error) {
        throw error;
    }
};

const getAllCampaignsByOrgId = async (orgId) => {
    try {
        const campaign = await CampaignModel.aggregate([
            {
                $match: {
                    orgId: new mongoose.Types.ObjectId(orgId),
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
        return campaign;
    } catch (error) {
        throw error;
    }
};

const getActiveCampaignsByOrgId = async (orgId) => {
    try {
        const now = new Date();
        const campaign = await CampaignModel.aggregate([
            {
                $match: {
                    orgId: new mongoose.Types.ObjectId(orgId),
                    startedAt: { $lte: now },
                    endedAt: { $gte: now },
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
        return campaign;
    } catch (error) {
        throw error;
    }
};

export default {
    create,
    update,
    getList,
    getListByAdmin,
    getCampaignById,
    getAllCampaignIdsByOrgId,
    getAllCampaignsByOrgId,
    getActiveCampaignsByOrgId,
};
