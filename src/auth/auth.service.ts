import { compareHash } from '../common/helper/crypto.helper'
import { encode } from '../common/helper/jwt.helper'
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
        return error
    }
}

const registerOrg = async (orgDto: RegisterOrgDto): Promise<BaseOrgDto | Error> => {
    try {
        return await orgsService.createOrgUser(orgDto)
    } catch (error) {
        throw error
    }
}

const loginUser = async (loginDto: LoginDto): Promise<LoginResponse> => {
    try {
        const user: UserDto = await userService.getUserByEmail(loginDto.email)
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

const checkUserNickName = async (queryDto: QueryDto) => {
    try {
        return await userService.getUserByNickName(queryDto.nickname)
    } catch (error) {
        throw error
    }
}

const checkOrgNickName = async (queryDto: QueryDto) => {
    try {
        return await orgsService.getOrgUserByNickName(queryDto.nickname)
    } catch (error) {
        throw error
    }
}


export default { registerUser, registerOrg, loginOrg, loginUser, checkUserNickName, checkOrgNickName }