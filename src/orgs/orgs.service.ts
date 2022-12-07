
import { RegisterOrgDto, RegisterUserDto } from '../auth/dto/request.dto'
import { PaginationDto } from '../common/dto/request.dto'
import { makeHash } from '../common/helper/crypto.helper'
import { logger } from '../logger/winston.logger'
import { BaseOrgDto, OrgDto } from "./dto/request.dto"
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

const createOrgUser = async (orgDto: RegisterOrgDto): Promise<BaseOrgDto | Error> => {
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


const getList = async (paginationDto: PaginationDto): Promise<Array<BaseOrgDto>> => {
    try {
        const orgs: Array<BaseOrgDto> = await OrgModel.find({}).skip(paginationDto.page * paginationDto.limit).limit(paginationDto.limit).sort({ createdAt: -1 }).select("-password")
        return orgs
    } catch (error) {
        throw error
    }
}

export default { getOrgUserByEmail, partialUpdate, getOrgUserByNickName, createOrgUser, getList }