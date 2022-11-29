import { validateOrReject, ValidationError } from "class-validator";
import { logger } from '../../logger/winston.logger'

const validateBody = async <T extends object>(body: T) => {
    try {
        await validateOrReject(body, { validationError: { target: false } })
    } catch (errors) {
        logger.error("validation error: " + errors)
        throw {
            message: "Validation Error",
            errors
        }
    }
}

export { validateBody }