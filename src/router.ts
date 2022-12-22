import { Router } from "express";
import test from "./test/test.controller";

import auth from "./api/v1/auth/auth.controller";
import orgs from "./api/v1/orgs/orgs.controller";
import campaigns from "./api/v1/campaigns/campaigns.controller";
import notices from "./api/v1/notices/notice.controller";
import news from "./api/v1/news/news.controller";
import faqs from "./api/v1/faq/faq.controller";
import banner from "./api/v1/banner/banner.controller";
import donation from "./api/v1/donation/donation.controller";
import order from "./api/v1/order/order.controller";
import subscriptionOrder from "./api/v1/subscription/subscription.controller";
import nft from "./api/v1/nft/nft.controller";
import utils from "./api/v1/utils/utils.controller";

const router: Router = Router();

router.use("/test", test);

router.use("/api/v1/auth", auth);
router.use("/api/v1/org", orgs);
router.use("/api/v1/campaign", campaigns);
router.use("/api/v1/news", news);
router.use("/api/v1/notice", notices);
router.use("/api/v1/faq", faqs);
router.use("/api/v1/banner", banner);
router.use("/api/v1/order", order);
router.use("/api/v1/subscription-order", subscriptionOrder);
router.use("/api/v1/donation", donation);
router.use("/api/v1/nft", nft);
router.use("/api/v1/utils", utils);

export default router;
