import mongoose, { Types } from "mongoose";
import { logger } from "../../../logger/winston.logger";
import { NoticeModel } from "./schema/notice.schema";

const createNotice = async newsData => {
  try {
    const _notice = await NoticeModel.create(newsData);

    return _notice;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const getNotice = async () => {
  try {
    const _notice = await NoticeModel.aggregate([
      {
        $match: { status: "APPROVED" }
      },
      {
        $lookup: {
          from: "orgs",
          foreignField: "_id",
          localField: "orgId",
          as: "org"
        }
      },
      {
        $unwind: "$org"
      }
    ]);

    return _notice;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const getNoticeById = async newsId => {
  try {
    const _notice = await NoticeModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(newsId), status: "APPROVED" }
      },
      {
        $lookup: {
          from: "orgs",
          foreignField: "_id",
          localField: "orgId",
          as: "org"
        }
      },
      {
        $unwind: "$org"
      }
    ]);

    return _notice[0];
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const getNoticeByOrgId = async orgId => {
  try {
    const _notice = await NoticeModel.aggregate([
      {
        $match: {
          orgId: new mongoose.Types.ObjectId(orgId),
          status: "APPROVED"
        }
      },
      {
        $lookup: {
          from: "orgs",
          foreignField: "_id",
          localField: "orgId",
          as: "org"
        }
      },
      {
        $unwind: "$org"
      }
    ]);

    return _notice[0];
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export default {
  createNotice,
  getNotice,
  getNoticeById,
  getNoticeByOrgId
};
