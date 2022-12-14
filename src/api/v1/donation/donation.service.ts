import mongoose from "mongoose";
import { DonationModel } from "./schema/donation.schema";

const createDonation = async donationData => {
  try {
    const newDonation = await DonationModel.create(donationData);
    return newDonation;
  } catch (error) {
    throw error;
  }
};

const getMyDonation = async userId => {
  try {
    const donations = await DonationModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: "orgs",
          foreignField: "_id",
          localField: "orgId",
          as: "org"
        }
      },
      { $unwind: "$org" },
      { $sort: { createdAt: -1 } }
    ]);
    return donations;
  } catch (error) {
    throw error;
  }
};

export default { createDonation, getMyDonation };
