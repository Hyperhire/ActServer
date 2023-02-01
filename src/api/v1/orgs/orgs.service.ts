import { IdDto } from "../../../common/dto/request.dto";
import { makeHash } from "../../../common/helper/crypto.helper";
import { logger } from "../../../logger/winston.logger";
import { RegisterOrgDto, RegisterUserDto } from "../auth/dto/request.dto";
import { BaseOrgDto, OrgDto } from "./dto/request.dto";
import { OrgModel } from "./schema/org.schema";
import {
    LoginType,
    OrderPaidStatus,
    OrgStatus,
    TLoginType,
} from "./../../../common/constants";
import { OrderModel } from "../order/schema/order.schema";
import { SubscriptionModel } from "../subscription/schema/subscription.schema";
import { Types } from "mongoose";
import { CampaignModel } from "../campaigns/schema/campaign.schema";
import { WithdrawModel } from "../withdraw/schema/withdraw.schema";

const selectInfo = { bankDetail: 0, password: 0 };

const createOrg = async (orgDto) => {
    try {
        if (orgDto.loginType === LoginType.EMAIL) {
            let org = await getOrgByEmail(orgDto.email);
            if (org) {
                throw "Email already exists";
            }
            const passwordHash = await makeHash(orgDto.password);
            orgDto.password = passwordHash;
        } else if (orgDto.socialProfile.clientId) {
            const orgExist = await getOrgByClientId(
                orgDto.loginType,
                orgDto.socialProfile.clientId
            );
            if (orgExist) {
                throw `${orgDto.loginType}-${orgDto.socialProfile.clientId} already exists`;
            }
        }

        const org = await OrgModel.create(orgDto);
        return org;
    } catch (error) {
        throw error;
    }
};

const updateOrg = async (orgId, updateData) => {
    try {
        const updatedOrg = await OrgModel.findOneAndUpdate(
            { _id: orgId },
            { ...updateData, updatedAt: new Date().toISOString() },
            { new: true }
        )
            .select(selectInfo)
            .lean();

        return updatedOrg;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const updateOrgByAdmin = async (orgId, updateData) => {
    try {
        const updatedOrg = await OrgModel.findOneAndUpdate(
            { _id: orgId },
            { ...updateData, updatedAt: new Date().toISOString() },
            { new: true }
        ).lean();

        return updatedOrg;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getOrgById = async (orgId) => {
    try {
        const org = await OrgModel.findOne({
            _id: orgId,
        })
            .select(selectInfo)
            .lean();
        return org;
    } catch (error) {
        throw error;
    }
};

const getOrgByIdByAdmin = async (orgId) => {
    try {
        const org = await OrgModel.findOne({
            _id: orgId,
        }).lean();
        return org;
    } catch (error) {
        throw error;
    }
};

const getOrgByEmail = async (email) => {
    // This is used for login
    try {
        const org = await OrgModel.findOne({
            email: email,
        }).lean();
        return org;
    } catch (error) {
        throw error;
    }
};

const getOrgByClientId = async (loginType: TLoginType, clientId: number) => {
    // This is used for login
    try {
        const org = await OrgModel.findOne({
            loginType,
            "socialProfile.clientId": clientId,
        }).lean();
        return org;
    } catch (error) {
        throw error;
    }
};

const getOrgByNickName = async (nickname) => {
    try {
        const org = await OrgModel.findOne({
            nickname: nickname,
        })
            .select(selectInfo)
            .lean();
        return org;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getList = async (query) => {
    try {
        const { limit, lastIndex } = query;
        const pagination = { totalCount: 0, lastIndex: 0, hasNext: true };
        const _limit = 1 * limit || 20;
        const _lastIndex = 1 * lastIndex || 0;
        const searchQuery = {
            status: OrgStatus.AUTHORIZED,
        };

        const _result = await OrgModel.find(searchQuery)
            .sort({ createdAt: -1 })
            .select(selectInfo)
            .skip(_lastIndex)
            .limit(_limit)
            .lean();

        const totalCount = await OrgModel.countDocuments(searchQuery);
        const currentLastIndex = _lastIndex + _result.length;

        pagination.totalCount = totalCount;
        pagination.lastIndex = currentLastIndex;
        pagination.hasNext = totalCount === currentLastIndex ? false : true;

        return {
            pagination,
            list: _result,
        };
    } catch (error) {
        throw error;
    }
};

const getListByAdmin = async (query) => {
    try {
        const { limit, lastIndex } = query;
        const pagination = { totalCount: 0, lastIndex: 0, hasNext: true };
        const _limit = 1 * limit || 20;
        const _lastIndex = 1 * lastIndex || 0;
        const searchQuery = {} as any;
        if (query?.keyword) {
            searchQuery.$or = [
                { "manager.name": { $regex: query?.keyword, $options: "i" } },
                { name: { $regex: query?.keyword, $options: "i" } },
                { nickname: { $regex: query?.keyword, $options: "i" } },
                { "manager.mobile": { $regex: query?.keyword, $options: "i" } },
                { email: { $regex: query?.keyword, $options: "i" } },
            ];
        }
        if (query?.status) searchQuery.status = query.status;
        if (query?.from && query?.to) {
            searchQuery.$and = [
                { createdAt: { $gte: query.from } },
                { createdAt: { $lte: query.to } },
            ];
        } else if (query?.from) searchQuery.createdAt = { $gte: query.from };
        else if (query?.to) searchQuery.createdAt = { $gte: query.to };

        const _result = await OrgModel.find(searchQuery)
            .sort({ createdAt: -1 })
            .select(selectInfo)
            .skip(_lastIndex)
            .limit(_limit)
            .lean();

        const totalCount = await OrgModel.countDocuments(searchQuery);
        const currentLastIndex = _lastIndex + _result.length;

        pagination.totalCount = totalCount;
        pagination.lastIndex = currentLastIndex;
        pagination.hasNext = totalCount === currentLastIndex ? false : true;

        return {
            pagination,
            list: _result,
        };
    } catch (error) {
        throw error;
    }
};

const getOrgPgSummary = async (orgId) => {
    try {
        const result = {
            totalAmount: 0,
            currentSubscriptionAmount: 0,
            withdrawAvailableAmount: 0,
        };

        const orgOrder = await OrderModel.aggregate([
            {
                $match: {
                    targetId: new Types.ObjectId(orgId),
                    paidStatus: OrderPaidStatus.APPROVED,
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);

        const campaigns = await CampaignModel.find({
            orgId,
        }).select("_id");

        const campaignOrder = await OrderModel.aggregate([
            {
                $match: {
                    targetId: {
                        $in: campaigns.map((campaign) => campaign._id),
                    },
                    paidStatus: OrderPaidStatus.APPROVED,
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);

        const subscription = await SubscriptionModel.aggregate([
            {
                $match: { targetId: new Types.ObjectId(orgId), active: true },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);

        let alreadyWithdrawedAmount = 0;
        const withdraw = await WithdrawModel.aggregate([
            {
                $match: { orgId: new Types.ObjectId(orgId) },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);

        if (orgOrder.length) {
            result.totalAmount = result.totalAmount + orgOrder[0].totalAmount;
        }
        if (campaignOrder.length) {
            result.totalAmount =
                result.totalAmount + campaignOrder[0].totalAmount;
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

const deleteOrg = async (id) => {
    try {
        const org = await OrgModel.findOneAndUpdate(
            { _id: id },
            { deletedAt: new Date().toISOString(), status: OrgStatus.DELETED },
            { new: true }
        ).lean();
        return org;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

export default {
    createOrg,
    updateOrg,
    updateOrgByAdmin,
    getOrgById,
    getOrgByIdByAdmin,
    getOrgByEmail,
    getOrgByNickName,
    getList,
    getListByAdmin,
    getOrgPgSummary,
    getOrgByClientId,
    deleteOrg,
};
