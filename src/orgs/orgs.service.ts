
import { RegisterOrgDto, RegisterUserDto } from '../auth/dto/request.dto'
import { BaseOrgDto, OrgDto } from "./dto/request.dto"
import { IdDto, PaginationDto } from '../common/dto/request.dto'
import { makeHash } from '../common/helper/crypto.helper'
import { logger } from '../logger/winston.logger'
import { OrgModel } from "./schema/org.schema"


const getOrgUserByNickName = async (nickname: string) => {
    try {
        const user: BaseOrgDto = await OrgModel.findOne({
            nickname: nickname
        })
        if (user) {
            throw "nickname already taken"
        }
        return true
    } catch (error) {
        logger.error(error)
        throw error
    }
}

const createOrg = async (orgDto: RegisterOrgDto): Promise<BaseOrgDto | Error> => {
    try {
        const passwordHash = await makeHash(orgDto.password)
        orgDto.password = passwordHash
        let org: OrgDto = await getOrgUserByEmail(orgDto.email)

        if (org) {
            throw "Email already exists"
        }

        org = await OrgModel.create(orgDto)

        return org
    } catch (error) {
        throw error
    }
}

const getOrgUserByEmail = async (email: string): Promise<OrgDto> => {
    try {
        const org: OrgDto = await OrgModel.findOne({
            email: email
        })
        return org
    } catch (error) {
        throw error
    }
}


const partialUpdate = async (id: string, body: any) => {
    try {

    } catch (error) {

    }
}


const getList = async (): Promise<Array<any>> => {
    try {
        const orgs: Array<any> = await OrgModel.find({}).sort({ createdAt: -1 }).select("-password")
        return orgs
    } catch (error) {
        throw error
    }
}

const getOrgById = async (idDto: IdDto): Promise<BaseOrgDto> => {
    try {
        const campaign: BaseOrgDto = await OrgModel.findOne({
            _id: idDto.id
        })
        return campaign
    } catch (error) {
        throw error
    }
}

export default { getOrgUserByEmail, partialUpdate, getOrgUserByNickName, createOrg, getList, getOrgById }