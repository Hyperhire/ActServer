
import { RegisterOrgDto, RegisterUserDto } from '../auth/dto/request.dto'
import { makeHash } from '../common/helper/crypto.helper'
import { logger } from '../logger/winston.logger'
import { BaseOrgDto } from "./dto/request.dto"
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
        const org: BaseOrgDto = await OrgModel.create(orgDto)
        return org
    } catch (error) {
        throw "User already exists"
    }
}

const getOrgUserByEmail = async (email: string): Promise<BaseOrgDto> => {
    try {
        const user: BaseOrgDto = await OrgModel.findOne({
            email: email
        })
        return user
    } catch (error) {
        throw error
    }
}


const partialUpdate = async (id: string, body: any) => {
    try {

    } catch (error) {

    }
}

export default { getOrgUserByEmail, partialUpdate, getOrgUserByNickName, createOrgUser }