import { validateOrReject } from "class-validator";
import { logger } from '../../logger/winston.logger'

const validateBody = async <T extends object>(body: T) => {
    try {
        await validateOrReject(body)
    } catch (errors) {
        logger.error("validation error: " + errors)
        return errors
    }
}

export { validateBody }