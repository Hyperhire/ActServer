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

router.use("/api/v1/faq", faqs)
router.use("/api/v1/org", orgs)
router.use("/api/v1/campaign", campaigns)
router.use("/api/v1/banner", banner)

export default router