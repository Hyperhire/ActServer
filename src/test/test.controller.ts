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

router.post(
  "/create-kas-wallet",
  async (request: Request, response: Response) => {
    try {
      console.log("create kas wallet");
      const wallet = await KasWallet.createWallet();
      return response.status(200).json({
        data: {
          text: "hello, this is conan from hyperhire",
          timestamp: new Date(),
          wallet
        }
      });
    } catch (error) {
      return response.status(400).json({ error });
    }
  }
);

export default router;
