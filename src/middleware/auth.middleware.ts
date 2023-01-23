import { Request, Response } from "express";
import { UserType } from "../common/constants";
import { unAuthorizedResponse } from "../common/dto/response.dto";
import { decode } from "../common/helper/jwt.helper";
import { logger } from "../logger/winston.logger";

const validOnlyUser = (req: Request, res: Response, next: Function) => {
    try {
        const { userType } = req["user"];
        if (userType !== UserType.INDIVIDUAL) {
            throw unAuthorizedResponse;
        }
        next();
    } catch (error) {
        logger.error(error);
        res.status(401).json(unAuthorizedResponse);
    }
};

const validOnlyOrg = (req: Request, res: Response, next: Function) => {
    try {
        const { userType } = req["user"];
        if (userType !== UserType.ORGANIZATION) {
            throw unAuthorizedResponse;
        }
        next();
    } catch (error) {
        logger.error(error);
        res.status(401).json(unAuthorizedResponse);
    }
};

const validOnlyAdmin = (req: Request, res: Response, next: Function) => {
    try {
        const { userType } = req["user"];
        if (userType !== UserType.ADMIN) {
            throw unAuthorizedResponse;
        }
        next();
    } catch (error) {
        logger.error(error);
        res.status(401).json(unAuthorizedResponse);
    }
};

export default { validOnlyUser, validOnlyOrg, validOnlyAdmin };
