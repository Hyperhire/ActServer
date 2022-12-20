import { IdDto } from "../../../common/dto/request.dto";
import { makeHash } from "../../../common/helper/crypto.helper";
import { logger } from "../../../logger/winston.logger";
import { RegisterOrgDto, RegisterUserDto } from "../auth/dto/request.dto";
import { BaseOrgDto, OrgDto } from "./dto/request.dto";
import { OrgModel } from "./schema/org.schema";
import { OrgStatus } from "./../../../common/constants";

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

const getOrgById = async id => {
  try {
    const org = await OrgModel.findOne({
      _id: id
    });
    return org;
  } catch (error) {
    throw error;
  }
};

const getOrgByEmail = async email => {
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
    });
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
      .select("-password");
    return orgs;
  } catch (error) {
    throw error;
  }
};

export default {
  createOrg,
  getOrgById,
  getOrgByEmail,
  getOrgByNickName,
  getList
};
