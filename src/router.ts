import { Router } from "express";
import hello from './hello/hello.controller'
import auth from './auth/auth.controller'
import orgs from './orgs/orgs.controller'
import campaigns from './campaigns/campaigns.controller'

import home from './home/home.controller'

const router: Router = Router()

router.use("/hello", hello)
router.use("/auth", auth)
router.use("/orgs", orgs)
router.use("/campaigns", campaigns)
router.use("/home", home)

export default router