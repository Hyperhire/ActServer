import { IdDto } from "../../../common/dto/request.dto";
import { makeHash } from "../../../common/helper/crypto.helper";
import { logger } from "../../../logger/winston.logger";
import { RegisterOrgDto, RegisterUserDto } from "../auth/dto/request.dto";
import { BaseOrgDto, OrgDto } from "./dto/request.dto";
import { OrgModel } from "./schema/org.schema";
import { OrderPaidStatus, OrgStatus } from "./../../../common/constants";
import { OrderModel } from "../order/schema/order.schema";
import { SubscriptionModel } from "../subscription/schema/subscription.schema";
import { Types } from "mongoose";
import { CampaignModel } from "../campaigns/schema/campaign.schema";
import { WithdrawModel } from "../withdraw/schema/withdraw.schema";

const selectInfo = { bankDetail: 0, password: 0 };

const createOrg = async orgDto => {
  try {
    let org = await getOrgByEmail(orgDto.email);

    if (org) {
      throw "Email already exists";
    }

    const passwordHash = await makeHash(orgDto.password);
    orgDto.password = passwordHash;

    org = await OrgModel.create(orgDto);

    return org;
  } catch (error) {
    throw error;
  }
};

const getOrgById = async orgId => {
  try {
    const org = await OrgModel.findOne({
      _id: orgId
    }).select(selectInfo);
    return org;
  } catch (error) {
    throw error;
  }
};

const getOrgByEmail = async email => {
  // This is used for login
  try {
    const org = await OrgModel.findOne({
      email: email
    });
    return org;
  } catch (error) {
    throw error;
  }
};

const getOrgByNickName = async nickname => {
  try {
    const org = await OrgModel.findOne({
      nickname: nickname
    }).select(selectInfo);
    return org;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const getList = async query => {
  try {
    const { limit, lastIndex } = query;
    const pagination = { totalCount: 0, lastIndex: 0, hasNext: true };
    const _limit = 1 * limit || 20;
    const _lastIndex = 1 * lastIndex || 0;
    const searchQuery = {
      status: OrgStatus.AUTHORIZED
    };

    const _result = await OrgModel.find(searchQuery)
      .sort({ createdAt: -1 })
      .select(selectInfo)
      .skip(_lastIndex)
      .limit(_limit);

    const totalCount = await OrgModel.countDocuments(searchQuery);
    const currentLastIndex = _lastIndex + _result.length;

    pagination.totalCount = totalCount;
    pagination.lastIndex = currentLastIndex;
    pagination.hasNext = totalCount === currentLastIndex ? false : true;

    return {
      pagination,
      list: _result
    };
  } catch (error) {
    throw error;
  }
};

const getOrgPgSummary = async orgId => {
  try {
    const result = {
      totalAmount: 0,
      currentSubscriptionAmount: 0,
      withdrawAvailableAmount: 0
    };

    const orgOrder = await OrderModel.aggregate([
      {
        $match: {
          targetId: new Types.ObjectId(orgId),
          paidStatus: OrderPaidStatus.APPROVED
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const campaigns = await CampaignModel.find({
      orgId
    }).select("_id");

    const campaignOrder = await OrderModel.aggregate([
      {
        $match: {
          targetId: { $in: campaigns.map(campaign => campaign._id) },
          paidStatus: OrderPaidStatus.APPROVED
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const subscription = await SubscriptionModel.aggregate([
      {
        $match: { targetId: new Types.ObjectId(orgId), active: true }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    let alreadyWithdrawedAmount = 0;
    const withdraw = await WithdrawModel.aggregate([
      {
        $match: { orgId: new Types.ObjectId(orgId) }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    if (orgOrder.length) {
      result.totalAmount = result.totalAmount + orgOrder[0].totalAmount;
    }
    if (campaignOrder.length) {
      result.totalAmount = result.totalAmount + campaignOrder[0].totalAmount;
    }
    if (subscription.length) {
      result.currentSubscriptionAmount = subscription[0].totalAmount;
    }
    if (withdraw.length) {
      alreadyWithdrawedAmount = withdraw[0].totalAmount;
    }
    result.withdrawAvailableAmount =
      result.totalAmount - alreadyWithdrawedAmount;

    return result;
  } catch (error) {
    throw error;
  }
};

export default {
  createOrg,
  getOrgById,
  getOrgByEmail,
  getOrgByNickName,
  getList,
  getOrgPgSummary
};
