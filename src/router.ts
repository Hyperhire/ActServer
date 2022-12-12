import { Router } from "express";
import hello from './hello/hello.controller'
import auth from './auth/auth.controller'
import orgs from './orgs/orgs.controller'
import campaigns from './campaigns/campaigns.controller'

import home from './home/home.controller'
import faqs from './faq/faq.controller'
import banner from './banner/banner.controller'

const router: Router = Router()

router.use("/hello", hello)
router.use("/auth", auth)
router.use("/orgs", orgs)
router.use("/campaigns", campaigns)
router.use("/faqs", faqs)
router.use("/home", home)
router.use("/banner", banner)

export default router