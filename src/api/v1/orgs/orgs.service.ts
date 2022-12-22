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

const getList = async () => {
  try {
    const orgs = await OrgModel.find({
      status: OrgStatus.AUTHORIZED
    })
      .sort({ createdAt: -1 })
      .select(selectInfo);
    return orgs;
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
    const order = await OrderModel.aggregate([
      {
        $match: {
          targetId: new Types.ObjectId(orgId),
          paidStatus: OrderPaidStatus.APPROVED
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalCount: { $sum: 1 }
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
          totalAmount: { $sum: "$amount" },
          totalCount: { $sum: 1 }
        }
      }
    ]);
    console.log("--", orgId, order, subscription);
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
