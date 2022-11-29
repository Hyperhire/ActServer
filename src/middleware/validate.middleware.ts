import { validateOrReject } from "class-validator";
import { Request, Response } from "express";
import { validationError } from '../common/dto/response.dto'
import { logger } from '../logger/winston.logger'

const validateBody = async (req: Request, res: Response, next: Function) => {
    try {
        const validatedBody = await validateOrReject(req.body)
        next()
    } catch (error) {
        logger.error(error)
        res.status(401).json(validationError)
    }
}
export { validateBody }