import { compareHash } from '../common/helper/crypto.helper'
import { encode } from '../common/helper/jwt.helper'
import { UserDto } from '../user/dto/request.dto'
import userService from '../user/user.service'
import { LoginDto, RegisterUserDto } from './dto/request.dto'
import { LoginResponse } from './dto/response.dto'

const registerUser = async (body: RegisterUserDto) => {
    try {
        return userService.createUser(body)
    } catch (error) {
        return error
    }
}

const registerOrg = async () => {
    try {

    } catch (error) {

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

const loginOrg = async () => {
    try {

    } catch (error) {

    }
}

const checkNickName = async () => {
    try {

    } catch (error) {

    }
}


export default { registerUser, registerOrg, loginOrg, loginUser, checkNickName }