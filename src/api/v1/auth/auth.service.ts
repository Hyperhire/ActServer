import { compareHash } from '../../../common/helper/crypto.helper'
import { encode } from '../../../common/helper/jwt.helper'
import { logger } from '../../../logger/winston.logger'
import { BaseOrgDto, OrgDto } from '../orgs/dto/request.dto'
import orgsService from '../orgs/orgs.service'
import { UserDto } from '../user/dto/request.dto'
import userService from '../user/user.service'
import { LoginDto, QueryDto, RegisterOrgDto, RegisterUserDto } from './dto/request.dto'
import { LoginResponse } from './dto/response.dto'

const registerUser = async (body: RegisterUserDto) => {
    try {
        return await userService.createUser(body)
    } catch (error) {
        logger.debug(error)
        throw error
    }
}

/**
 * 
 * @param orgDto 
 * @returns 
 */
const registerOrg = async (orgDto: RegisterOrgDto): Promise<BaseOrgDto | Error> => {
    try {
        return await orgsService.createOrg(orgDto)
    } catch (error) {
        throw error
    }
}


/**
 * 
 * @param loginDto 
 * @returns 
 */
const loginUser = async (loginDto: LoginDto): Promise<LoginResponse> => {
    try {
        const user: UserDto = await userService.getUserByEmail(loginDto.email)
        if(!user){
            throw "User not found"
        }
        const isEqualHash = await compareHash(loginDto.password, user.password)
        if (!isEqualHash) {
            throw "password missmatch"
        }
        const token = encode({ id: user._id.toString() })
        return {
            token
        }
    } catch (error) {
        throw error
    }
}

/**
 * 
 * @param loginDto 
 * @returns 
 */
const loginOrg = async (loginDto: LoginDto) => {
    try {
        const org: OrgDto = await orgsService.getOrgUserByEmail(loginDto.email)
        const isEqualHash = await compareHash(loginDto.password, org.password)
        if (!isEqualHash) {
            throw "password missmatch"
        }
        const token = encode({ id: org._id.toString() })
        return {
            token
        }
    } catch (error) {
        throw error
    }
}

/**
 * 
 * @param queryDto 
 * @returns 
 */
const checkUserNickName = async (queryDto: QueryDto) => {
    try {
        return await userService.getUserByNickName(queryDto.nickname)
    } catch (error) {
        throw error
    }
}

/**
 * 
 * @param queryDto 
 * @returns 
 */
const checkOrgNickName = async (queryDto: QueryDto) => {
    try {
        return await orgsService.getOrgUserByNickName(queryDto.nickname)
    } catch (error) {
        throw error
    }
}


export default { registerUser, registerOrg, loginOrg, loginUser, checkUserNickName, checkOrgNickName }