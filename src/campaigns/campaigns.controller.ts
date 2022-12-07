import { plainToInstance } from 'class-transformer'
import { Request, Router, Response } from 'express'
import { validateBody } from '../common/helper/validate.helper'
import { logger } from '../logger/winston.logger'
import campaignsService from './campaigns.service'
import { CreateCampaignDto } from './dto/request.dto'
import { CampaignDto, CampaignOrgDto } from './dto/response.dto'
import jwtMiddleware from './../middleware/jwt.middleware'
import { PaginationDto } from '../common/dto/request.dto'

const router = Router()

router.post("/", jwtMiddleware.verifyToken, async (request: Request, response: Response) => {
    try {
        request.body.orgId = request["user"].id
        const createCampaignDto = plainToInstance(CreateCampaignDto, request.body)
        await validateBody<CreateCampaignDto>(createCampaignDto)
        const campaign: CampaignDto = await campaignsService.create(createCampaignDto)
        return response.status(400).json(campaign)
    } catch (error) {
        logger.error(error)
        return response.status(400).json({ error })
    }
})
router.get("/:page/:limit", async (request: Request, response: Response) => {
    try {
        const paginationDto = plainToInstance(PaginationDto, request.params)
        await validateBody<PaginationDto>(paginationDto)
        const campaigns: Array<CampaignOrgDto> = await campaignsService.getList(paginationDto)
        return response.status(400).json(campaigns)
    } catch (error) {
        logger.error(error)
        return response.status(400).json({ error })
    }
})


export default router
