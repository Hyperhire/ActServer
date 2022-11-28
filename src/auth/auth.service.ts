import userService from '../user/user.service'

const registerUser = async <RegisterUserDto>(body: RegisterUserDto) => {
    try {
        return userService.createUser(body)
    } catch (error) {
        return error
    }
}

const registerOrganization = async () => {
    try {

    } catch (error) {

    }
}

const loginUser = async () => {
    try {

    } catch (error) {

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


export default { registerUser, registerOrganization, loginOrg, loginUser, checkNickName }