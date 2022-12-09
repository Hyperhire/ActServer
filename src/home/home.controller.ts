import { Request, Router, Response } from 'express'
import homeService from './home.service'

const router = Router()

router.get("/", async (request: Request, response: Response) => {
    try {
        response.status(200).json(await homeService.getHomePage())
    } catch (error) {
        response.status(400).json(error)
    }
})

router.post("/", async (request: Request, response: Response) => {
    try {
        response.status(200).json(await homeService.createHomePage())
    } catch (error) {
        response.status(400).json(error)
    }
})

export default router
