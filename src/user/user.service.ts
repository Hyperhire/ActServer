
import { RegisterUserDto } from '../auth/dto/request.dto'
import { makeHash } from '../common/helper/crypto.helper'
import { logger } from '../logger/winston.logger'
import { BaseUserDto, UserDto } from "./dto/request.dto"
import { UserSettingsModel } from './schema/user-settings.schema'
import { UserModel } from "./schema/user.schema"


const getUserByNickName = async (nickname: string) => {
    try {
        const user: BaseUserDto = await UserModel.findOne({
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

const createUser = async (userDto: RegisterUserDto): Promise<BaseUserDto | Error> => {
    try {
        const passwordHash = await makeHash(userDto.password)
        userDto.password = passwordHash
        let user: BaseUserDto = await getUserByEmail(userDto.email)
        if (user) {
            throw "Email already exists"
        }
        user = await UserModel.create(userDto)
        const userSettings = await UserSettingsModel.create({
            user_id: user._id,
            receiveReceipt: userDto.receiveReceipt
        })
        return user
    } catch (error) {
        throw error
    }
}

const getUserByEmail = async (email: string): Promise<UserDto> => {
    try {
        const user: UserDto = await UserModel.findOne({
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

export default { getUserByNickName, partialUpdate, getUserByEmail, createUser }