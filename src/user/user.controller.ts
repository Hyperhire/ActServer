import { Request, Router, Response } from 'express'

const router = Router()

router.get("/nickname", (request: Request, response: Response) => { })

router.get("/:id", (request: Request, response: Response) => { })

export default router
