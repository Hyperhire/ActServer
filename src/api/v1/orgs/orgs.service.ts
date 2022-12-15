import { IdDto } from "../../../common/dto/request.dto";
import { makeHash } from "../../../common/helper/crypto.helper";
import { logger } from "../../../logger/winston.logger";
import { RegisterOrgDto, RegisterUserDto } from "../auth/dto/request.dto";
import { BaseOrgDto, OrgDto } from "./dto/request.dto";
import { OrgModel } from "./schema/org.schema";

const createOrg = async (
  orgDto: RegisterOrgDto
): Promise<BaseOrgDto | Error> => {
  try {
    const passwordHash = await makeHash(orgDto.password);
    orgDto.password = passwordHash;
    let org: OrgDto = await getOrgUserByEmail(orgDto.email);

    if (org) {
      throw "Email already exists";
    }

    org = await OrgModel.create(orgDto);

    return org;
  } catch (error) {
    throw error;
  }
};

const getOrgUserByEmail = async (email: string): Promise<OrgDto> => {
  try {
    const org: OrgDto = await OrgModel.findOne({
      email: email
    });
    return org;
  } catch (error) {
    throw error;
  }
};

const getOrgUserByNickName = async (nickname: string) => {
  try {
    const org: BaseOrgDto = await OrgModel.findOne({
      nickname: nickname
    });
    return org;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const partialUpdate = async (id: string, body: any) => {
  try {
  } catch (error) {}
};

const getList = async (): Promise<Array<any>> => {
  try {
    const orgs: Array<any> = await OrgModel.find({})
      .sort({ createdAt: -1 })
      .select("-password");
    return orgs;
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

export default {
  getOrgUserByEmail,
  partialUpdate,
  getOrgUserByNickName,
  createOrg,
  getList,
  getOrgById
};
