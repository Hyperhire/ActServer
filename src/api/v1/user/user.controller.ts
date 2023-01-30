import { Request, Router, Response } from 'express'
import { logger } from '../../../logger/winston.logger'
import userService from './user.service'

const router = Router()

router.get("/search", async (request:Request, response: Response) => {
  try {
    const query = request.query;
    const { pagination, list } = await userService.getList(query);

    return response.status(200).json({ data: { pagination, list } });
  } catch (error) {
    console.log(error)
    logger.error(error);
    return response.status(400).json({ error });
  }
})

router.get("/:id", (request: Request, response: Response) => { })

export default router
