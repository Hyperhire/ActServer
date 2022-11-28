import { Request, Response } from "express";
import { unAuthorizedResponse } from '../common/dto/response.dto'
import { decode } from '../common/helper/jwt.helper'
import { logger } from '../logger/winston.logger'

const verifyToken = (req: Request, res: Response, next: Function) => {
    try {
        const token = req.headers["authorization"].split(" ")[0]
        const decoded = decode(token)
        logger.debug(decoded)
        req["user"] = decoded
        next()
    } catch (error) {
        logger.error(error)
        res.status(401).json(unAuthorizedResponse)
    }
}

export { verifyToken }