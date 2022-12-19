import mongoose from "mongoose";
import { CreateCampaignDto } from "./dto/request.dto";
import { CampaignModel } from "./schema/campaign.schema";

const create = async (campaignDto: CreateCampaignDto): Promise<any> => {
  try {
    const camapign = await CampaignModel.create(campaignDto);
    return camapign;
  } catch (error) {
    throw error;
  }
};

const getList = async () => {
  try {
    const camapigns = await CampaignModel.aggregate([
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
      //   {
      //     $project: {
      //       _id: 1,
      //       name: 1,
      //       startedAt: 1,
      //       endedAt: 1,
      //       orgId: 1,
      //       images: 1,
      //       org: {
      //         name: 1,
      //         manager: 1,
      //         homepage: 1,
      //         corporateId: 1,
      //         createdAt: 1,
      //         updatedAt: 1
      //       }
      //     }
      //   }
    ]);
    return camapigns;
  } catch (error) {
    throw error;
  }
};

const getCampaignById = async campaignId => {
  try {
    const campaign = await CampaignModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(campaignId) }
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
    return campaign[0];
  } catch (error) {
    throw error;
  }
};

const getCampaignByOrgId = async orgId => {
  try {
    const campaign = await CampaignModel.aggregate([
      {
        $match: { orgId: new mongoose.Types.ObjectId(orgId) }
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
    return campaign;
  } catch (error) {
    throw error;
  }
};

export default {
  create,
  getList,
  getCampaignById,
  getCampaignByOrgId
};
