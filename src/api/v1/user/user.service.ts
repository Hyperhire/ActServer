import { makeHash } from "../../../common/helper/crypto.helper";
import { logger } from "../../../logger/winston.logger";
import KasWallet from "../../../utils/kasWallet";
import { RegisterUserDto } from "../auth/dto/request.dto";
import { BaseUserDto, UserDto } from "./dto/request.dto";
import { UserModel } from "./schema/user.schema";

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
const getUserById = async (userId: string) => {
  try {
    const user = await UserModel.findOne({
      _id: userId
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email: string): Promise<UserDto> => {
  try {
    const user: UserDto = await UserModel.findOne({
      email: email
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserByNickName = async (nickname: string) => {
  try {
    const user: BaseUserDto = await UserModel.findOne({
      nickname: nickname
    }).select(selectInfo);
    return user;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const getUserPgSummary = async userId => {
  try {
    const totalAmount = 1000;
    console.log("totalAmount", totalAmount);
  } catch (error) {
    throw error;
  }
};

export default {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByNickName,
  getUserPgSummary
};
