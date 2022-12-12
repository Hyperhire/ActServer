
import { logger } from '../logger/winston.logger'
import { BannerModel } from './schema/banner.schema'


const createBanner: (bannerData: any)=> any = async (bannerData) => {
    try {
        const newBanners = await BannerModel.create(bannerData)
        
        return newBanners;
    } catch (error) {
        logger.error(error)
        throw error
    }
}

export default {createBanner};