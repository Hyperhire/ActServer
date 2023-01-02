import mongoose from "mongoose";
import { OrderType } from "../../../common/constants";
import { DonationModel } from "./schema/donation.schema";
import campaignsService from "../campaigns/campaigns.service";

const createDonation = async donationData => {
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
        new: true
      }
    );
    return newDonation;
  } catch (error) {
    throw error;
  }
};

const getMyIndDonation = async userId => {
  try {
    const orgDonations = await DonationModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          targetType: OrderType.ORGANIZATION
        }
      },
      {
        $lookup: {
          from: "orgs",
          foreignField: "_id",
          localField: "targetId",
          as: "org"
        }
      },
      {
        $lookup: {
          from: "orders",
          foreignField: "donationId",
          localField: "_id",
          as: "orders"
        }
      },
      { $unwind: "$org" },
      { $sort: { createdAt: -1 } }
    ]);
    const campaignDonations = await DonationModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          targetType: OrderType.CAMPAIGN
        }
      },
      {
        $lookup: {
          from: "campaigns",
          foreignField: "_id",
          localField: "targetId",
          as: "campaign"
        }
      },
      { $unwind: "$campaign" },
      {
        $lookup: {
          from: "orgs",
          foreignField: "_id",
          localField: "campaign.orgId",
          as: "org"
        }
      },
      {
        $lookup: {
          from: "orders",
          foreignField: "donationId",
          localField: "_id",
          as: "orders"
        }
      },
      { $unwind: "$org" },
      { $sort: { createdAt: -1 } }
    ]);
    return {
      orgs: orgDonations,
      campaigns: campaignDonations
    };
  } catch (error) {
    throw error;
  }
};

const getMyOrgDonation = async orgId => {
  try {
    const orgDonations = await DonationModel.aggregate([
      {
        $match: {
          targetId: new mongoose.Types.ObjectId(orgId),
          targetType: OrderType.ORGANIZATION
        }
      },
      {
        $lookup: {
          from: "orgs",
          foreignField: "_id",
          localField: "targetId",
          as: "org"
        }
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "user"
        }
      },
      {
        $lookup: {
          from: "orders",
          foreignField: "donationId",
          localField: "_id",
          as: "orders"
        }
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
          user: { nickname: 1 }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    const campaignList = await campaignsService.getAllCampaignIdsByOrgId(orgId);

    const campaignDonations = await DonationModel.aggregate([
      {
        $match: {
          targetId: { $in: campaignList },
          targetType: OrderType.CAMPAIGN
        }
      },
      {
        $lookup: {
          from: "campaigns",
          foreignField: "_id",
          localField: "targetId",
          as: "campaign"
        }
      },
      { $unwind: "$campaign" },
      {
        $lookup: {
          from: "orgs",
          foreignField: "_id",
          localField: "campaign.orgId",
          as: "org"
        }
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "user"
        }
      },
      {
        $lookup: {
          from: "orders",
          foreignField: "donationId",
          localField: "_id",
          as: "orders"
        }
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
            description: 1
          },
          org: { name: 1 },
          user: { nickname: 1 }
        }
      },
      { $unwind: "$org" },
      { $unwind: "$user" },
      { $sort: { createdAt: -1 } }
    ]);

    return {
      orgs: orgDonations,
      campaigns: campaignDonations
    };
  } catch (error) {
    throw error;
  }
};

const getOrgDonationsByUserId = async userId => {
  try {
    const list = await DonationModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      targetType: OrderType.ORGANIZATION
    })
      .select({ targetId: 1 })
      .lean();

    return list;
  } catch (error) {
    throw error;
  }
};

const getCampaignDonationsByUserId = async userId => {
  try {
    const list = await DonationModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      targetType: OrderType.CAMPAIGN
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
  getMyIndDonation,
  getMyOrgDonation,
  getOrgDonationsByUserId,
  getCampaignDonationsByUserId
};
