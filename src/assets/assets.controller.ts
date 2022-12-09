import { plainToInstance } from 'class-transformer'
import { Request, Router, Response } from 'express'
import { validateBody } from '../common/helper/validate.helper'
import { logger } from '../logger/winston.logger'
import assetService from './assets.service'
import { CreateAsset } from './dto/request.dto'

const router = Router()

router.post("/", async (request: Request, response: Response) => {
    try {
        const assetCreate = plainToInstance(CreateAsset, request.body)
        await validateBody<CreateAsset>(assetCreate)
        const response = assetService.createAsset(assetCreate)
    } catch (error) {
        logger.error(error)
        return response.status(400).json({ error })
    }
})

export default router
