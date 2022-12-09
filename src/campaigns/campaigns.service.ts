import { IdDto, PaginationDto } from "../common/dto/request.dto";
import { logger } from "../logger/winston.logger";
import { CreateCampaignDto } from "./dto/request.dto";
import { CampaignDto, CampaignOrgDto } from "./dto/response.dto";
import { CampaignModel } from "./schema/campaign.schema";

const create = async (campaignDto: CreateCampaignDto): Promise<any> => {
    try {
        const camapign: CampaignDto = await CampaignModel.create(campaignDto)
        return camapign
    } catch (error) {
        throw error
    }
}


const getList = async (paginationDto: PaginationDto): Promise<Array<CampaignOrgDto>> => {
    try {
        logger.info(JSON.stringify(paginationDto))
        const camapigns: Array<CampaignOrgDto> = await CampaignModel.aggregate([
            {
                $lookup: {
                    from: "orgs",
                    foreignField: "_id",
                    localField: "orgId",
                    as: "org"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    start_at: 1,
                    end_at: 1,
                    orgId: 1,
                    org: { $arrayElemAt: ["$org", 0] },
                    images: 1
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    start_at: 1,
                    end_at: 1,
                    orgId: 1,
                    images: 1,
                    org: {
                        "email": 1,
                        "nickname": 1,
                        "orgName": 1,
                        "managerName": 1,
                        "managerMobile": 1,
                        "homepage": 1,
                        "corporateId": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                    }
                }
            },
            {
                $skip: paginationDto.page * paginationDto.limit
            },
            {
                $limit: paginationDto.limit
            }
        ])
        return camapigns
    } catch (error) {
        throw error
    }
}


const getCampaignById = async (idDto: IdDto): Promise<CampaignDto> => {
    try {
        const campaign: CampaignDto = await CampaignModel.findOne({
            _id: idDto.id
        })
        return campaign
    } catch (error) {
        throw error
    }
}

export default {
    create,
    getList,
    getCampaignById
}