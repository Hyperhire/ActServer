import { Request, Router, Response } from "express";
import KasWallet from "../utils/kasWallet";
import multer from "multer";
import { getBuckets, uploadFile } from "../utils/upload";
import { kakaopayRequestSubcriptionPayment } from "../utils/kakaopay";
import authMiddleware from "../middleware/auth.middleware";
import jwtMiddleware from "../middleware/jwt.middleware";
import { sendTestMail } from "../utils/mailer";
import { getKey, setKey } from "../utils/redis";

const router = Router();
const upload = multer();

interface MulterRequest extends Request {
  file: any;
}

router.get("/", (request: Request, response: Response) => {
  try {
    return response.json({
      status: 200,
      data: {
        text: "hello, this is conan from hyperhire",
        timestamp: new Date()
      }
    });
  } catch (error) {
    return response.json({ status: 400, error });
  }
});

router.post("/mail", async (request: Request, response: Response) => {
  const result = await sendTestMail();
  try {
    return response.json({
      status: 200,
      data: {
        result,
        timestamp: new Date()
      }
    });
  } catch (error) {
    return response.json({ status: 400, error });
  }
});

router.post("/redis", async (request: Request, response: Response) => {
  const result = await setKey("test", "hello");
  try {
    return response.json({
      status: 200,
      data: {
        result,
        timestamp: new Date()
      }
    });
  } catch (error) {
    return response.json({ status: 400, error });
  }
});

router.get("/redis", async (request: Request, response: Response) => {
  const result = await getKey("test");
  try {
    return response.json({
      status: 200,
      data: {
        result,
        timestamp: new Date()
      }
    });
  } catch (error) {
    return response.json({ status: 400, error });
  }
});

// //TODO: form data 처리하는게 이슈네
// router.post(
//   "/register-nft-image",
//   upload.single("file"),
//   async (request: MulterRequest, response: Response) => {
//     try {
//       const file = request?.file
//       console.log("file", file);
//       if (!file) {
//         throw 'no image';
//       }
//       const image = KasWallet.registerNftImage(file);
//       return response.status(201).json({
//         data: {
//           text: "register NFT",
//           timestamp: new Date(),
//           image
//         }
//       });
//     } catch (error) {
//       return response.status(400).json({ error });
//     }
//   }
// );

export default router;
