import mongoose, { Types } from "mongoose";
import { logger } from "../../../logger/winston.logger";
import { NewsModel } from "./schema/news.schema";
import { PostStatus } from "./../../../common/constants";

const createNews = async (newsData) => {
    try {
        const _news = await NewsModel.create(newsData);

        return _news;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const updateNews = async (id, updateData) => {
    try {
        const updated = await NewsModel.findOneAndUpdate(
            { _id: id },
            { ...updateData, updatedAt: new Date().toISOString() },
            { new: true }
        ).lean();
        return updated;
    } catch (error) {
        throw error;
    }
};

const getNews = async (query) => {
    try {
        const { limit, lastIndex, keyword } = query;
        const pagination = { totalCount: 0, lastIndex: 0, hasNext: true };
        const _limit = 1 * limit || 20;
        const _lastIndex = 1 * lastIndex || 0;
        const searchQuery = { status: PostStatus.APPROVED };

        if (keyword) {
            searchQuery["$or"] = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }
        const _result = await NewsModel.aggregate([
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

        const totalCount = await NewsModel.countDocuments(searchQuery);
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

const getNewsByAdmin = async (query) => {
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

        const _result = await NewsModel.aggregate([
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

        const totalCount = await NewsModel.countDocuments(searchQuery);
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

const getNewsById = async (newsId) => {
    try {
        const _news = await NewsModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(newsId),
                    status: "APPROVED",
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

        return _news[0];
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getNewsByOrgId = async (orgId) => {
    try {
        const _news = await NewsModel.aggregate([
            {
                $match: {
                    orgId: new mongoose.Types.ObjectId(orgId),
                    status: "APPROVED",
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

        return _news;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getNewsByOrgIdByAdmin = async (orgId) => {
    try {
        const _news = await NewsModel.aggregate([
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

        return _news;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

export default {
    createNews,
    updateNews,
    getNews,
    getNewsByAdmin,
    getNewsById,
    getNewsByOrgId,
    getNewsByOrgIdByAdmin,
};
