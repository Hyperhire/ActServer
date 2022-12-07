import { plainToInstance } from 'class-transformer'
import { Request, Router, Response } from 'express'
import { PaginationDto } from '../common/dto/request.dto'
import { validateBody } from '../common/helper/validate.helper'
import { logger } from '../logger/winston.logger'
import { BaseOrgDto } from './dto/request.dto'
import orgsService from './orgs.service'

const router = Router()

router.get("/:page/:limit", async (request: Request, response: Response) => {
    try {
        logger.info(JSON.stringify(request.params))
        const paginationDto = plainToInstance(PaginationDto, request.params)
        await validateBody<PaginationDto>(paginationDto)
        const orgs: Array<BaseOrgDto> = await orgsService.getList(paginationDto)
        return response.status(400).json(orgs)
    } catch (error) {
        logger.error(error)
        return response.status(400).json({ error })
    }
})

export default router


