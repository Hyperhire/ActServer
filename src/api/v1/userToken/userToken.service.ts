import { UserTokenModel } from "./schema/userToken.schema";

const createOrUpdate = async userTokenData => {
  try {
    let updatedUserToken = await UserTokenModel.findOneAndUpdate(
      {
        userId: userTokenData.userId
      },
      userTokenData,
      { new: true }
    ).lean();
    if (!updatedUserToken) {
      updatedUserToken = await UserTokenModel.create(userTokenData);
    }
    return updatedUserToken;
  } catch (error) {
    throw error;
  }
};

const getUserTokenByRefreshToken = async refreshToken => {
  try {
    const userToken = await UserTokenModel.findOne({ refreshToken });
    return userToken;
  } catch (error) {
    return error;
  }
};

export default { createOrUpdate, getUserTokenByRefreshToken };
