import { Types } from "mongoose";
import { logger } from "../../../logger/winston.logger";
import { BannerModel } from "./schema/banner.schema";

const createBanner = async bannerData => {
  try {
    const newBanners = await BannerModel.create(bannerData);

    return newBanners;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const getBanners = async () => {
  try {
    const filter = {
      show: true
    };
    const banners = await BannerModel.find(filter);

    return banners;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const updateBanner = async (bannerId, updateData) => {
  try {
    const updatedBanner = await BannerModel.findOneAndUpdate(
      { _id: bannerId },
      updateData,
      { new: true }
    );

    return updatedBanner;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export default { createBanner, getBanners, updateBanner };