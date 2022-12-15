import { Request, Router, Response } from "express";
import KasWallet from "../utils/kasWallet";
import multer from "multer";

const router = Router();
const upload = multer();

interface MulterRequest extends Request {
  file: any;
}

router.get("/", (request: Request, response: Response) => {
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

//TODO: form data 처리하는게 이슈네
router.post(
  "/register-nft-image",
  upload.single("file"),
  async (request: MulterRequest, response: Response) => {
    try {
      const file = request?.file
      console.log("file", file);
      if (!file) {
        throw 'no image';
      }
      const image = KasWallet.registerNftImage(file);
      return response.status(201).json({
        data: {
          text: "register NFT",
          timestamp: new Date(),
          image
        }
      });
    } catch (error) {
      return response.status(400).json({ error });
    }
  }
);

router.post(
  "/create-metadata",
  async (request: Request, response: Response) => {
    try {
      const metadata = await KasWallet.createMetadata();
      return response.status(201).json({
        data: {
          text: "create metadata",
          timestamp: new Date(),
          metadata
        }
      });
    } catch (error) {
      return response.status(400).json({ error });
    }
  }
);

router.post("/mint-nft", async (request: Request, response: Response) => {
  try {
    const nft = await KasWallet.mintNft();
    return response.status(201).json({
      data: {
        text: "mint NFT",
        timestamp: new Date(),
        nft
      }
    });
  } catch (error) {
    return response.status(400).json({ error });
  }
});

router.get("/nft/detail", async (request: Request, response: Response) => {
  try {
    const nftDetail = await KasWallet.getNftDataTest();
    return response.status(201).json({
      data: {
        text: "mint NFT",
        timestamp: new Date(),
        nftDetail
      }
    });
  } catch (error) {
    return response.status(400).json({ error });
  }
});

export default router;
