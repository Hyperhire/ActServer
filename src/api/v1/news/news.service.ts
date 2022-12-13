import mongoose, { Types } from "mongoose";
import { logger } from "../../../logger/winston.logger";
import { NewsModel } from "./schema/news.schema";

const createNews = async newsData => {
  try {
    const _news = await NewsModel.create(newsData);

    return _news;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const getNews = async () => {
  try {
    const _news = await NewsModel.aggregate([
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

    return _news;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const getNewsById = async newsId => {
  try {
    const _news = await NewsModel.aggregate([
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

    return _news;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const getNewsByOrgId = async orgId => {
  try {
    const _news = await NewsModel.aggregate([
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

    return _news;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export default {
  createNews,
  getNews,
  getNewsById,
  getNewsByOrgId
};
