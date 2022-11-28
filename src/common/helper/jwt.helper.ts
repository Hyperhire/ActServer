import { config } from "../../config/config";
import jwt from 'jsonwebtoken'
import { UserToken } from "../dto/response.dto";

const decode = (token: string) => {
    try {
        const decoded = jwt.verify(token, config.jwtKey)
        return decoded
    } catch (error) {
        throw error
    }
}
const encode = (userData: UserToken) => {
    try {
        return jwt.sign(userData, config.jwtKey, { expiresIn: '1w' })
    } catch (error) {
        throw error
    }
}

export { decode, encode }