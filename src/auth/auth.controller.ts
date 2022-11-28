import { Request, Router, Response } from 'express'

const router = Router()

router.post("/user/login", (request: Request, response: Response) => {
    try {

    } catch (error) {
        return response.json(error)
    }
})

router.post("/org/login", (request: Request, response: Response) => {
    try {

    } catch (error) {
        return response.json(error)
    }
})

router.post("/org/register", (request: Request, response: Response) => {
    try {

    } catch (error) {
        return response.json(error)
    }
})

router.post("/user/register", (request: Request, response: Response) => {
    try {

    } catch (error) {
        return response.json(error)
    }
})

export default router
