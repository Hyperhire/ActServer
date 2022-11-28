import { Request, Router, Response } from 'express'
import { RegisterUserDto } from 'src/common/dto/request.dto'
import { validateBody } from 'src/middleware/validate.middleware'
import authService from './auth.service'

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

router.post("/user/register", validateBody<RegisterUserDto>() ,async (request: Request, response: Response) => {
    try {
        return await authService.registerUser(request.body)
    } catch (error) {
        return response.json(error)
    }
})

export default router
