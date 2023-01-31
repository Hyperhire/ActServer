import { Router } from "express";
import test from "./test/test.controller";
import health from "./health/health.controller";
import auth from "./api/v1/auth/auth.controller";
import orgs from "./api/v1/orgs/orgs.controller";
import users from "./api/v1/user/user.controller";
import campaigns from "./api/v1/campaigns/campaigns.controller";
import notices from "./api/v1/notices/notice.controller";
import news from "./api/v1/news/news.controller";
import faqs from "./api/v1/faq/faq.controller";
import banner from "./api/v1/banner/banner.controller";
import donation from "./api/v1/donation/donation.controller";
import withdraw from "./api/v1/withdraw/withdraw.controller";
import order from "./api/v1/order/order.controller";
import subscription from "./api/v1/subscription/subscription.controller";
import nft from "./api/v1/nft/nft.controller";
import utils from "./api/v1/utils/utils.controller";

import authAdmin from "./api/v1/admin/admin.controller";
import userAdmin from "./api/v1/user/user.adminController";
import orgAdmin from "./api/v1/orgs/orgs.adminController";
import campaignAdmin from "./api/v1/campaigns/campaigns.adminController";
import newsAdmin from "./api/v1/news/news.adminController";
import noticesAdmin from "./api/v1/notices/notice.adminController";
import faqsAdmin from "./api/v1/faq/faq.adminController";
import bannerAdmin from "./api/v1/faq/faq.adminController";
import orderAdmin from "./api/v1/order/order.adminController";
import donationAdmin from "./api/v1/donation/donation.adminController";
import withdrawAdmin from "./api/v1/withdraw/withdraw.adminController";

const router: Router = Router();

router.use("/test", test);
router.use("/health", health);

router.use("/api/v1/auth", auth);
router.use("/api/v1/org", orgs);
router.use("/api/v1/user", users);
router.use("/api/v1/campaign", campaigns);
router.use("/api/v1/news", news);
router.use("/api/v1/notice", notices);
router.use("/api/v1/faq", faqs);
router.use("/api/v1/banner", banner);
router.use("/api/v1/order", order);
router.use("/api/v1/subscription", subscription);
router.use("/api/v1/donation", donation);
router.use("/api/v1/withdraw", withdraw);
router.use("/api/v1/nft", nft);
router.use("/api/v1/utils", utils);

router.use("/api/admin/v1/auth", authAdmin);
router.use("/api/admin/v1/user", userAdmin);
router.use("/api/admin/v1/org", orgAdmin);
router.use("/api/admin/v1/campaign", campaignAdmin);
router.use("/api/admin/v1/news", newsAdmin);
router.use("/api/admin/v1/notice", noticesAdmin);
router.use("/api/admin/v1/faq", faqsAdmin);
router.use("/api/admin/v1/banner", bannerAdmin);
router.use("/api/admin/v1/order", orderAdmin);
// router.use("/api/admin/v1/subscription", subscriptionAdmin);
router.use("/api/admin/v1/donation", donationAdmin);
router.use("/api/admin/v1/withdraw", withdrawAdmin);

export default router;
