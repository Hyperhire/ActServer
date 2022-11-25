import { Request, Router, Response } from 'express'

const router = Router()

router.get("", (request: Request, response: Response)=>{
    response.json({
        status: 200
    })
})

export default router