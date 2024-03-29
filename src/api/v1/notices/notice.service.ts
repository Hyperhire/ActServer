import mongoose, { Types } from "mongoose";
import { logger } from "../../../logger/winston.logger";
import { NoticeModel } from "./schema/notice.schema";
import { PostStatus } from "./../../../common/constants";

const createNotice = async (newsData) => {
    try {
        const _notice = await NoticeModel.create(newsData);

        return _notice;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const updateNotice = async (id, updateData) => {
    try {
        const notice = await NoticeModel.findOneAndUpdate(
            { _id: id },
            { ...updateData, updatedAt: new Date().toISOString() },
            { new: true }
        ).lean();

        return notice;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getNotice = async (query) => {
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

        const _result = await NoticeModel.aggregate([
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

        const totalCount = await NoticeModel.countDocuments(searchQuery);
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

const getNoticeByAdmin = async (query) => {
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
                { createdAt: { $gte: new Date(query.from) } },
                { createdAt: { $lte: new Date(query.to) } },
            ];
        } else if (query?.from) searchQuery.createdAt = { $gte: new Date(query.from) };
        else if (query?.to) searchQuery.createdAt = { $gte: new Date(query.to) };

        const _result = await NoticeModel.aggregate([
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
                $unwind: { path: "$org", preserveNullAndEmptyArrays: true },
            },
        ]);

        const totalCount = await NoticeModel.countDocuments(searchQuery);
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

const getNoticeById = async (noticeId) => {
    try {
        const _notice = await NoticeModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(noticeId),
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

        return _notice[0];
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getNoticeByIdByAdmin = async (noticeId) => {
    try {
        const _notice = await NoticeModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(noticeId),
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

        return _notice[0];
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getNoticeByOrgId = async (orgId) => {
    try {
        const _notice = await NoticeModel.aggregate([
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

        return _notice;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getNoticeByOrgIdByAdmin = async (orgId) => {
    try {
        const _notice = await NoticeModel.aggregate([
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

        return _notice;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

export default {
    createNotice,
    updateNotice,
    getNotice,
    getNoticeByAdmin,
    getNoticeById,
    getNoticeByIdByAdmin,
    getNoticeByOrgId,
    getNoticeByOrgIdByAdmin,
};
