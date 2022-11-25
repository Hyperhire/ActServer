import { Router } from "express";
import hello from './hello/hello.controller'

const router: Router = Router()

router.use("/hello", hello)

export default router