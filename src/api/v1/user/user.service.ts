import { makeHash } from "../../../common/helper/crypto.helper";
import { logger } from "../../../logger/winston.logger";
import KasWallet from "../../../utils/kasWallet";
import { RegisterUserDto } from "../auth/dto/request.dto";
import { OrderModel } from "../order/schema/order.schema";
import { BaseUserDto, UserDto } from "./dto/request.dto";
import { UserModel } from "./schema/user.schema";
import { Types } from "mongoose";
import { LoginType, OrderPaidStatus } from "./../../../common/constants";
import { SubscriptionModel } from "../subscription/schema/subscription.schema";

const selectInfo = {};

const createUser = async (userDto) => {
    try {
        if (userDto.loginType === LoginType.EMAIL) {
            const userExist = await getUserByEmail(userDto.email);
            if (userExist) {
                throw "Email already exists";
            }
            const passwordHash = await makeHash(userDto.password);
            userDto.password = passwordHash;
        } else if (userDto.socialProfile.clientId) {
            const userExist = await getUserBySocialClientId(
                userDto.loginType,
                userDto.socialProfile.clientId
            );
            if (userExist) {
                throw `${userDto.loginType}-${userDto.socialProfile.clientId} already exists`;
            }
        }
        const wallet = await KasWallet.createWallet();
        userDto.wallet = wallet;

        const user = await UserModel.create(userDto);
        return user;
    } catch (error) {
        throw error;
    }
};

const updateUser = async (userId, updateData) => {
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            { ...updateData, updatedAt: new Date().toISOString() },
            { new: true }
        )
            .select(selectInfo)
            .lean();

        return updatedUser;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getUserById = async (userId: string) => {
    try {
        const user = await UserModel.findOne({
            _id: userId,
        }).lean();
        if (!user) throw "user doesn't exist";
        return user;
    } catch (error) {
        throw error;
    }
};

const getUserBySocialClientId = async (loginType: string, clientId: string) => {
    try {
        const user = await UserModel.findOne({
            loginType,
            "socialProfile.clientId": clientId,
        }).lean();
        return user;
    } catch (error) {
        throw error;
    }
};

const getUserByEmail = async (email: string): Promise<UserDto> => {
    try {
        const user: UserDto = await UserModel.findOne({
            email: email,
        }).lean();
        return user;
    } catch (error) {
        throw error;
    }
};

const getUserByClientId = async (
    loginType: string,
    clientId: number
): Promise<UserDto> => {
    try {
        const user: UserDto = await UserModel.findOne({
            loginType,
            "socialProfile.clientId": clientId,
        }).lean();
        return user;
    } catch (error) {
        throw error;
    }
};

const getUserByNickName = async (nickname: string) => {
    try {
        const user: BaseUserDto = await UserModel.findOne({
            nickname: nickname,
        })
            .select(selectInfo)
            .lean();
        return user;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getUserPgSummary = async (userId) => {
    try {
        const result = {
            totalAmount: 0,
            totalCount: 0,
            currentSubscriptionAmount: 0,
            totalSubscriptionCount: 0,
        };

        const order = await OrderModel.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    paidStatus: OrderPaidStatus.APPROVED,
                    paymentType: { $exists: true },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    totalCount: { $sum: 1 },
                },
            },
        ]);

        const subscription = await SubscriptionModel.aggregate([
            {
                $match: { userId: new Types.ObjectId(userId) },
            },
            {
                $group: {
                    _id: "$active",
                    totalAmount: { $sum: "$amount" },
                    totalCount: { $sum: 1 },
                },
            },
        ]);

        if (order.length) {
            result.totalAmount = order[0].totalAmount;
            result.totalCount = order[0].totalCount;
        }
        if (subscription.length) {
            result.currentSubscriptionAmount = subscription.filter(
                (item) => item._id
            )[0].totalAmount;
            result.totalSubscriptionCount = subscription.reduce(
                (a, b) => a + b.totalCount,
                0
            );
        }
        return result;
    } catch (error) {
        throw error;
    }
};

const getList = async (query) => {
    try {
        const { limit, lastIndex } = query;
        const pagination = { totalCount: 0, lastIndex: 0, hasNext: true };
        const _limit = 1 * limit || 10;
        const _lastIndex = 1 * lastIndex || 0;

        let searchQuery: any;
        if (query?.userType) searchQuery.userType = query.userType;
        if (query?.status) searchQuery.status = query.status;
        if (query?.from && query?.to) {
            searchQuery.$and = [
                { createdAt: { $gte: query.from } },
                { createdAt: { $lte: query.to } },
            ];
        } else if (query?.from) searchQuery.createdAt = { $gte: query.from };
        else if (query?.to) searchQuery.createdAt = { $gte: query.to };

        const _result = await UserModel.find(searchQuery)
            .sort({ createdAt: -1 })
            .select(selectInfo)
            .skip(_lastIndex)
            .limit(_limit)
            .lean();

        const totalCount = await UserModel.countDocuments(searchQuery);
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

const deleteUser = async (id: string) => {
    try {
        const res = await UserModel.findOneAndDelete({
            _id: id,
        });
        return res;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

export default {
    createUser,
    updateUser,
    getUserById,
    getUserByEmail,
    getUserByNickName,
    getUserPgSummary,
    getUserBySocialClientId,
    getUserByClientId,
    getList,
    deleteUser,
};
