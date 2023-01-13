import { TLoginType, UserType } from "../../../common/constants";
import { compareHash } from "../../../common/helper/crypto.helper";
import { createJWT, encode } from "../../../common/helper/jwt.helper";
import { logger } from "../../../logger/winston.logger";
import { getKakaoProfile } from "../../../utils/kakaoLogin";
import adminService from "../admin/admin.service";
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

const registerUser = async body => {
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
const registerOrg = async body => {
  try {
    return await orgsService.createOrg(body);
  } catch (error) {
    throw error;
  }
};

const registerAdmin = async (id:string, password:string) => {
  try {
    return await adminService.createAdmin(id, password);
  } catch (error) {
    logger.debug(error);
    throw error;
  }
};

/**
 * 
 * @param loginDto 
 * @returns 
 */
const loginUser = async (loginDto: LoginDto) => {
  try {
    const user = await userService.getUserByEmail(loginDto.email);

    if (!user) {
      throw "User not found";
    }

    const isEqualHash = await compareHash(loginDto.password, user.password);
    if (!isEqualHash) {
      throw "password missmatch";
    }

    const token = createJWT({
      id: user._id.toString(),
      userType: UserType.INDIVIDUAL
    });

    return { token, user, userType: UserType.INDIVIDUAL };
  } catch (error) {
    throw error;
  }
};

const loginAdmin = async (id: string, password: string) => {
  try {
    const admin = await adminService.getUserById(id);

    if (!admin) {
      throw "Admin not found";
    }

    const isEqualHash = await compareHash(password, admin.password);
    if (!isEqualHash) {
      throw "password missmatch";
    }

    const token = createJWT({
      id: admin._id.toString(),
      userType: UserType.ADMIN
    });

    return { token, admin, userType: UserType.ADMIN };
  } catch (error) {
    throw error;
  }
};

const loginUserSocial = async (loginType: TLoginType, clientId: number) => {
  try {
    const user = await userService.getUserByClientId(loginType, clientId);

    if (!user) {
      throw "User not found";
    }

    const token = createJWT({
      id: user._id.toString(),
      userType: UserType.INDIVIDUAL
    });

    return { token, user, userType: UserType.INDIVIDUAL };
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

    const token = createJWT({
      id: org._id.toString(),
      userType: UserType.ORGANIZATION
    });

    return {
      token,
      org,
      userType: UserType.ORGANIZATION
    };
  } catch (error) {
    throw error;
  }
};

const loginOrgSocial = async (loginType: TLoginType, clientId: number) => {
  try {
    const org = await orgsService.getOrgByClientId(loginType, clientId);
    
    const token = createJWT({
      id: org._id.toString(),
      userType: UserType.ORGANIZATION
    });

    return {
      token,
      org,
      userType: UserType.ORGANIZATION
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

const checkUserTypeOnLoginByClientId = async (loginType: TLoginType, clientId: number) => {
  try {
    const user = await userService.getUserByClientId(loginType, clientId);
    if (!!user) {
      return UserType.INDIVIDUAL;
    }
    const org = await orgsService.getOrgByClientId(loginType, clientId);
    if (!!org) {
      return UserType.ORGANIZATION;
    }
    throw Error("user not found")
  } catch (error) {
    throw error;
  }
};

export default {
  registerUser,
  registerOrg,
  registerAdmin,
  loginOrg,
  loginUser,
  loginAdmin,
  checkNickName,
  checkEmail,
  checkOrgNickName,
  checkUserTypeOnLoginByEmail,
  checkUserTypeOnLoginByClientId,
  getKakaoProfile,
  loginUserSocial,
  loginOrgSocial
};
