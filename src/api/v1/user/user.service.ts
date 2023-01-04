import { makeHash } from "../../../common/helper/crypto.helper";
import { logger } from "../../../logger/winston.logger";
import KasWallet from "../../../utils/kasWallet";
import { RegisterUserDto } from "../auth/dto/request.dto";
import { OrderModel } from "../order/schema/order.schema";
import { BaseUserDto, UserDto } from "./dto/request.dto";
import { UserModel } from "./schema/user.schema";
import { Types } from "mongoose";
import { OrderPaidStatus } from "./../../../common/constants";
import { SubscriptionModel } from "../subscription/schema/subscription.schema";

const selectInfo = {};

const createUser = async userDto => {
  try {
    const userExist = await getUserByEmail(userDto.email);
    if (userExist) {
      throw "Email already exists";
    }
    const passwordHash = await makeHash(userDto.password);
    userDto.password = passwordHash;
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
      _id: userId
    }).lean();
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserBySocialClientId = async (loginType: string, clientId: string) => {
  try {
    const user = await UserModel.findOne({
      loginType,
      "socialProfile.id": clientId
    }).lean();
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email: string): Promise<UserDto> => {
  try {
    const user: UserDto = await UserModel.findOne({
      email: email
    }).lean();
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserByNickName = async (nickname: string) => {
  try {
    const user: BaseUserDto = await UserModel.findOne({
      nickname: nickname
    })
      .select(selectInfo)
      .lean();
    return user;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const getUserPgSummary = async userId => {
  try {
    const result = {
      totalAmount: 0,
      totalCount: 0,
      currentSubscriptionAmount: 0,
      totalSubscriptionCount: 0
    };

    const order = await OrderModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          paidStatus: OrderPaidStatus.APPROVED,
          paymentType: { $exists: true }
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
        $match: { userId: new Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: "$active",
          totalAmount: { $sum: "$amount" },
          totalCount: { $sum: 1 }
        }
      }
    ]);

    if (order.length) {
      result.totalAmount = order[0].totalAmount;
      result.totalCount = order[0].totalCount;
    }
    if (subscription.length) {
      result.currentSubscriptionAmount = subscription.filter(
        item => item._id
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

export default {
  createUser,
  updateUser,
  getUserById,
  getUserByEmail,
  getUserByNickName,
  getUserPgSummary,
  getUserBySocialClientId
};
