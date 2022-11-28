import { RegisterUserDto } from "src/common/dto/request.dto"
import { makeHash } from '../common/helper/crypto.helper'
import { BaseUserDto } from "./dto/request.dto"
import { UserModel } from "./schema/user.schema"


const getUserByNickName = async (id: string) => {
    try {

    } catch (error) {

    }
}

const createUser = async (userDto: RegisterUserDto): Promise<BaseUserDto> => {
    try {
        const passwordHash = await makeHash(userDto.password)
        userDto.password = passwordHash
        const user: BaseUserDto = await UserModel.create(userDto)
        return user
    } catch (error) {
        return error
    }
}

const getUserByEmail = async () => {
    try {

    } catch (error) {

    }
}


const partialUpdate = async (id: string, body: any) => {
    try {

    } catch (error) {

    }
}

export default { getUserByNickName, partialUpdate, getUserByEmail, createUser }