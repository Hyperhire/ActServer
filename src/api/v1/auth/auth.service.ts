import { UserType } from "../../../common/constants";
import { compareHash } from "../../../common/helper/crypto.helper";
import { encode } from "../../../common/helper/jwt.helper";
import { logger } from "../../../logger/winston.logger";
import { BaseOrgDto, OrgDto } from "../orgs/dto/request.dto";
import orgsService from "../orgs/orgs.service";
import { UserDto } from "../user/dto/request.dto";
import userService from "../user/user.service";
import {
  LoginDto,
  QueryDto,
  RegisterOrgDto,
  RegisterUserDto
} from "./dto/request.dto";
import { LoginResponse } from "./dto/response.dto";

const registerUser = async (body: RegisterUserDto) => {
  try {
    return await userService.createUser(body);
  } catch (error) {
    logger.debug(error);
    throw error;
  }
};

/**
 * 
 * @param orgDto 
 * @returns 
 */
const registerOrg = async orgDto => {
  try {
    return await orgsService.createOrg(orgDto);
  } catch (error) {
    throw error;
  }
};

/**
 * 
 * @param loginDto 
 * @returns 
 */
const loginUser = async (loginDto: LoginDto): Promise<LoginResponse> => {
  try {
    const user: UserDto = await userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw "User not found";
    }
    const isEqualHash = await compareHash(loginDto.password, user.password);
    if (!isEqualHash) {
      throw "password missmatch";
    }
    const token = encode({
      id: user._id.toString(),
      userType: UserType.INDIVIDUAL
    });
    return {
      token
    };
  } catch (error) {
    throw error;
  }
};

/**
 * 
 * @param loginDto 
 * @returns 
 */
const loginOrg = async (loginDto: LoginDto) => {
  try {
    const org = await orgsService.getOrgByEmail(loginDto.email);
    const isEqualHash = await compareHash(loginDto.password, org.password);
    if (!isEqualHash) {
      throw "password missmatch";
    }
    const token = encode({
      id: org._id.toString(),
      userType: UserType.ORGANIZATION
    });
    return {
      token
    };
  } catch (error) {
    throw error;
  }
};

/**
 * 
 * @param queryDto 
 * @returns 
 */
const checkNickName = async nickname => {
  try {
    const user = await userService.getUserByNickName(nickname);
    const org = await orgsService.getOrgByNickName(nickname);
    return { duplicated: !!user || !!org };
  } catch (error) {
    throw error;
  }
};

const checkEmail = async email => {
  try {
    const user = await userService.getUserByEmail(email);
    const org = await orgsService.getOrgByEmail(email);
    return { duplicated: !!user || !!org };
  } catch (error) {
    throw error;
  }
};

/**
 * 
 * @param queryDto 
 * @returns 
 */
const checkOrgNickName = async (queryDto: QueryDto) => {
  try {
    return await orgsService.getOrgByNickName(queryDto.nickname);
  } catch (error) {
    throw error;
  }
};

const checkUserTypeOnLoginByEmail = async email => {
  try {
    const user = await userService.getUserByEmail(email);
    if (!!user) {
      return UserType.INDIVIDUAL;
    }
    const org = await orgsService.getOrgByEmail(email);
    if (!!org) {
      return UserType.ORGANIZATION;
    }
    throw "user not found";
  } catch (error) {
    throw error;
  }
};

export default {
  registerUser,
  registerOrg,
  loginOrg,
  loginUser,
  checkNickName,
  checkEmail,
  checkOrgNickName,
  checkUserTypeOnLoginByEmail
};
