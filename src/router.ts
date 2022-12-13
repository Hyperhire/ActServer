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

const router: Router = Router();

router.use("/hello", test);

router.use("/auth", auth);
/**
 * @swagger
 * tags:
 *   name: User
 *   description: 유저 조회
 */
router.use("/api/v1/user", auth);
/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: 기부 단체 조회
 */
router.use("/api/v1/org", orgs);
/**
 * @swagger
 * tags:
 *   name: Campaign
 *   description: 캠페인 조회
 */
router.use("/api/v1/campaign", campaigns);
/**
 * @swagger
 * tags:
 *   name: News
 *   description: 뉴스 조회
 */
router.use("/api/v1/news", news);
/**
 * @swagger
 * tags:
 *   name: Notice
 *   description: 공시 조회
 */
router.use("/api/v1/notice", notices);
/**
 * @swagger
 * tags:
 *   name: FAQ
 *   description: FAQ 조회
 */
router.use("/api/v1/faq", faqs);
/**
 * @swagger
 * tags:
 *   name: Baenner
 *   description: Banner 조회
 */
router.use("/api/v1/banner", banner);
router.use("/api/v1/donation", donation);

export default router;
