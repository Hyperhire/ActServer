import { Types } from "mongoose";
import { logger } from "../../../logger/winston.logger";
import { BannerModel } from "./schema/banner.schema";

const createBanner = async (bannerData) => {
    try {
        const sequence = (await getMaxSeq()) + 1;

        const newBanners = await BannerModel.create({
            ...bannerData,
            sequence,
        });

        return newBanners;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getBanners = async () => {
    try {
        const filter = {
            show: true,
        };
        const banners = await BannerModel.find(filter);

        return banners;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getBannersByAdmin = async () => {
    try {
        const banners = await BannerModel.find({}).sort({ sequence: 1 });

        return banners;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getBannerByIdByAdmin = async (id) => {
    try {
        const banner = await BannerModel.findOne({ _id: id });

        return banner;
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

const getMaxSeq = async () => {
    try {
        const { sequence } = await BannerModel.findOne({}).sort({
            sequence: -1,
        });
        return sequence;
    } catch (error) {
        throw error;
    }
};

export default {
    createBanner,
    getBanners,
    getBannersByAdmin,
    getBannerByIdByAdmin,
    updateBanner,
    getMaxSeq,
};
