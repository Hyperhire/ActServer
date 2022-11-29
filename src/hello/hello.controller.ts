import { Request, Router, Response } from 'express'

const router = Router()

router.get("/", (request: Request, response: Response) => {
    response.json({
        status: 200,
        timestamp: new Date().toISOString()
    })
})

export default router