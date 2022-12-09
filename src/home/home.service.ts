import campaignsService from '../campaigns/campaigns.service'
import { CampaignOrgDto } from '../campaigns/dto/response.dto'
import { PaginationDto } from '../common/dto/request.dto'
import { FAQ } from '../faq/dto/response.dto'
import faqService from '../faq/faq.service'
import orgsService from '../orgs/orgs.service'
import { Banner, Campaign, HomePageDto, Notice, Organization, Static } from './dto/response.dto'
import { HomeModel } from './schema/home.schema'

const getHomePage = async (): Promise<any> => {
    try {
        const homePage: HomePageDto = await HomeModel.findOne({})

        if (!homePage) {
            throw "no data found"
        }
        return {
            banners: await banners(),
            campaigns: await campaigns(),
            orgs: await orgs(),
            notices: await notices(),
            faqs: await faqs(),
            static: await staticData()
        }

    } catch (error) {
        console.log(error)
        throw error
    }
}

const banners = async (): Promise<Array<Banner>> => {
    try {
        return [
            {
                imageUrl: "https://gdb.voanews.com/1eaa6e0a-8eed-4275-b7df-e59637b7cce3_w1023_r1_s.jpg",
                navigation: {
                    navigationType: "url",
                    action: "https://www.voanews.com/a/east-asia-pacific_south-korea-blocks-ngo-sending-bibles-rice-north/6190576.html"
                },
            },
            {
                imageUrl: "https://gdb.voanews.com/1eaa6e0a-8eed-4275-b7df-e59637b7cce3_w1023_r1_s.jpg",
                navigation: {
                    navigationType: "url",
                    action: "https://www.voanews.com/a/east-asia-pacific_south-korea-blocks-ngo-sending-bibles-rice-north/6190576.html"
                },
            },

        ]
    } catch (error) {
        throw error
    }
}

const campaigns = async (): Promise<Array<Campaign>> => {
    try {
        const campaigns: Array<CampaignOrgDto> = await campaignsService.getList({
            page: 0, limit: 5
        })
        return campaigns.map((c: CampaignOrgDto): Campaign => {
            return {
                campaignImage: c.images[0],
                short_Descriptions: c.short_description || "",
                target: c.target || "350000",
                _id: c._id.toString(),
                title: c.name
            }
        })
    } catch (error) {
        throw error
    }
}

const orgs = async (): Promise<Array<Organization>> => {
    try {
        const paginationDto = new PaginationDto()
        paginationDto.limit = 5
        paginationDto.page = 0
        const organizations: Array<any> = await orgsService.getList(paginationDto)
        return organizations.map((c: any): Organization => {
            return {
                _id: c._id,
                icon: c.icon,
                name: c.name,
                images: c.images
            }
        })
    } catch (error) {
        throw error
    }
}

const notices = async (): Promise<Array<Notice>> => {
    try {
        return [
            {
                title: "test notice 1",
                description: "test notice 1",
                issued_at: new Date(),
            },
            {
                title: "test notice 1",
                description: "test notice 1",
                issued_at: new Date(),
            }
        ]
    } catch (error) {
        throw error
    }
}

const faqs = async (): Promise<Array<FAQ>> => {
    try {
        return await faqService.getFaqs({
            page: 0,
            limit: 3
        })
    } catch (error) {
        throw error
    }
}

const staticData = async (): Promise<Static> => {
    try {
        return {
            content: "<p>This is static content</p>"
        }
    } catch (error) {
        throw error
    }
}

const createHomePage = async () => {
    try {
        const homeenum = ["BANNER", "ORGS", "CAMPAIGNS", "NOTICES", "FAQS", "STATIC"]
        console.log(homeenum)
        const homeSchema = {
            banners: homeenum[0],
            orgs: homeenum[1],
            campaigns: homeenum[2],
            notices: homeenum[3],
            faqs: homeenum[4],
            static: homeenum[5]
        }
        console.log(homeSchema)
        return await HomeModel.create(homeSchema)
    } catch (error) {
        throw error
    }
}


export default {
    getHomePage,
    createHomePage
}