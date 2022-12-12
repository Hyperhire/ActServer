import { Router } from "express";
import test from './test/test.controller'
import auth from './auth/auth.controller'
import orgs from './orgs/orgs.controller'
import campaigns from './campaigns/campaigns.controller'

import faqs from './faq/faq.controller'
import banner from './banner/banner.controller'

const router: Router = Router()

router.use("/hello", test)
router.use("/auth", auth)
router.use("/orgs", orgs)
router.use("/campaign", campaigns)

router.use("/faq", faqs)
router.use("/banner", banner)

export default router