import { plainToInstance } from 'class-transformer'
import { Request, Router, Response } from 'express'
import { validateBody } from '../common/helper/validate.helper'
import { logger } from '../logger/winston.logger'
import authService from './auth.service'
import { LoginDto, RegisterUserDto } from './dto/request.dto'

const router = Router()

router.post("/user/login", async (request: Request, response: Response) => {
    try {
        const loginDto = plainToInstance(LoginDto, request.body)
        await validateBody<LoginDto>(loginDto)
        const result = await authService.loginUser(loginDto)
        response.json(result)
    } catch (error) {
        logger.error(error)
        return response.status(400).json({ error })
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

router.post("/user/register", async (request: Request, response: Response) => {
    try {
        const user = plainToInstance(RegisterUserDto, request.body)
        await validateBody<RegisterUserDto>(user)
        const result = await authService.registerUser(user)
        response.json(result)
    } catch (error) {
        logger.error(error)
        return response.status(400).json({ error })
    }
})

export default router
