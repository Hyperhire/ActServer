import { config } from "../../config/config";
import jwt from "jsonwebtoken";
import { UserToken } from "../dto/response.dto";

const decode = (token: string) => {
  try {
    if (!token) throw "Token is empty"
    const decoded = jwt.verify(token, config.jwtKey);
    return decoded;
  } catch (error) {
    throw error;
  }
};

const encode = (userData: UserToken, expiresIn: string | number) => {
  try {
    const options = {
      expiresIn
    };
    return jwt.sign(userData, config.jwtKey, options);
  } catch (error) {
    throw error;
  }
};

const createJWT = (userData: UserToken) => {
  const now = new Date().valueOf();
  try {
    return {
      accessToken: "Bearer " + encode(userData, config.JWT_EXPIRE_TIME_ACCESS),
      accessTokenExpiresAt: now + config.JWT_EXPIRE_TIME_ACCESS * 1000,
      refreshToken:
        "Bearer " + encode(userData, config.JWT_EXPIRE_TIME_REFRESH),
      refreshTokenExpiresAt: now + config.JWT_EXPIRE_TIME_REFRESH * 1000
    };
  } catch (error) {
    throw error;
  }
};

export { createJWT, decode, encode };
