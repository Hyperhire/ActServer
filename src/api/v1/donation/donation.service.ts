import mongoose from "mongoose";
import { OrderType } from "../../../common/constants";
import { DonationModel } from "./schema/donation.schema";

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

const getMyDonation = async userId => {
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
  getMyDonation,
  getOrgDonationsByUserId,
  getCampaignDonationsByUserId
};
