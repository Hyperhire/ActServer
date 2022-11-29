import { Router } from "express";
import hello from './hello/hello.controller'
import auth from './auth/auth.controller'

const router: Router = Router()

router.use("/hello", hello)
router.use("/auth", auth)

export default router