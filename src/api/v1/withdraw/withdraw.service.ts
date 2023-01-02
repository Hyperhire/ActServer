import mongoose from "mongoose";
import campaignsService from "../campaigns/campaigns.service";
import { WithdrawModel } from "./schema/withdraw.schema";
import { OrderModel } from "../order/schema/order.schema";
import {
  OrderWithdrawRequestStatus,
  WithdrawStatus
} from "../../../common/constants";

const createWithdraw = async data => {
  try {
    const withdraw = await WithdrawModel.create(data);
    return withdraw;
  } catch (error) {
    throw error;
  }
};

const getWithdrawPreRequestListByOrgId = async orgId => {
  try {
    const orgCampaigns = await campaignsService.getAllCampaignIdsByOrgId(orgId);
    const amountByStatus = await OrderModel.aggregate([
      {
        $match: {
          targetId: {
            $in: [...orgCampaigns, new mongoose.Types.ObjectId(orgId)]
          }
        }
      },
      {
        $group: {
          _id: "$withdrawRequestStatus",
          amount: { $sum: "$amount" }
        }
      }
    ]);

    const NOT_YET_AMOUNT =
      (amountByStatus.filter(status => !status._id)[0]?.amount || 0) +
      (amountByStatus.filter(
        status => status._id === OrderWithdrawRequestStatus.NOT_YET
      )[0]?.amount || 0);

    const REQUESTED_AMOUNT =
      amountByStatus.filter(
        status => status._id === OrderWithdrawRequestStatus.REQUESTED
      )[0]?.amount || 0;

    const org_order_list = await OrderModel.aggregate([
      {
        $match: {
          targetId: new mongoose.Types.ObjectId(orgId)
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
      { $unwind: "$org" },
      { $sort: { createdAt: -1 } }
    ]);

    const campaign_order_list = await OrderModel.aggregate([
      {
        $match: {
          targetId: { $in: [...orgCampaigns] }
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
      { $unwind: "$org" },
      { $sort: { createdAt: -1 } }
    ]);

    const all_list = [...org_order_list, ...campaign_order_list].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );

    const NOT_YET = all_list.filter(
      order =>
        !order.withdrawRequestStatus ||
        order.withdrawRequestStatus === OrderWithdrawRequestStatus.NOT_YET
    );
    const REQUESTED = all_list.filter(
      order => order.withdrawRequestStatus === OrderWithdrawRequestStatus.REQUESTED
    );

    return {
      amount: {
        NOT_YET: NOT_YET_AMOUNT,
        REQUESTED: REQUESTED_AMOUNT
      },
      list: { NOT_YET, REQUESTED }
    };
  } catch (error) {
    throw error;
  }
};

const getWithdrawListByOrgId = async orgId => {
  try {
    const res = await WithdrawModel.find({ orgId }).lean();
    const PENDING = res.filter(item => item.status === WithdrawStatus.PENDING);
    const COMPLETE = res.filter(
      item => item.status === WithdrawStatus.COMPLETE
    );
    const PENDING_AMOUNT = PENDING.reduce((a, b) => a + b.amount, 0);
    const COMPLETE_AMOUNT = COMPLETE.reduce((a, b) => a + b.amount, 0);
    return {
      amount: {
        PENDING: PENDING_AMOUNT,
        COMPLETE: COMPLETE_AMOUNT
      },
      list: {
        PENDING,
        COMPLETE
      }
    };
  } catch (error) {
    throw error;
  }
};

export default {
  createWithdraw,
  getWithdrawPreRequestListByOrgId,
  getWithdrawListByOrgId
};
