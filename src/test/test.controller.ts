import { Request, Router, Response } from "express";
import KasWallet from "../utils/kasWallet";

const router = Router();

router.get("/", (request: Request, response: Response) => {
  response.json({
    status: 200,
    data: {
      text: "hello, this is conan from hyperhire",
      timestamp: new Date()
    }
  });
});

router.get("/nft", (request: Request, response: Response) => {
  KasWallet.hello();
  response.json({
    status: 200,
    data: {
      text: "hello, this is conan from hyperhire",
      timestamp: new Date()
    }
  });
});

export default router;
