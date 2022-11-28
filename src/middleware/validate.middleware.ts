import { validateOrReject } from "class-validator";
import { Request, Response } from "express";
import { validationError } from '../common/dto/response.dto'
import { logger } from '../logger/winston.logger'

const validateBody = <T>() => {
    return (req: Request, res: Response, next: Function)=> {
        try {
            const validatedBody = validateOrReject(req.body)
            next()
        } catch (error) {
            logger.error(error)
            res.status(401).json(validationError)
        }
    }
}

export { validateBody }