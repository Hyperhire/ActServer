import { config } from "../../config/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserToken } from "../dto/response.dto";

const decode = (token: string) => {
  try {
    if (!token) throw "Token is empty";
    const decoded = jwt.verify(token.split(" ").slice(-1)[0], config.jwtKey);
    return decoded as UserToken;
  } catch (error) {
    throw error;
  }
};

const encode = (userData: UserToken, expiresIn: string | number) => {
  try {
    const options = {
      expiresIn
    };
    return "Bearer " + jwt.sign(userData, config.jwtKey, options);
  } catch (error) {
    throw error;
  }
};

const createJWT = (userData: UserToken) => {
  const now = new Date().valueOf();
  try {
    return {
      accessToken: encode(userData, config.JWT_EXPIRE_TIME_ACCESS),
      accessTokenExpiresAt: now + config.JWT_EXPIRE_TIME_ACCESS * 1000,
      refreshToken: encode(userData, config.JWT_EXPIRE_TIME_REFRESH),
      refreshTokenExpiresAt: now + config.JWT_EXPIRE_TIME_REFRESH * 1000
    };
  } catch (error) {
    throw error;
  }
};

export { createJWT, decode, encode };
