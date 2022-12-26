import { Request, Router, Response } from "express";
import KasWallet from "../utils/kasWallet";
import multer from "multer";
import { getBuckets, uploadFile } from "../utils/upload";
import { kakaopayRequestSubcriptionPayment } from "../utils/kakaopay";
import authMiddleware from "../middleware/auth.middleware";
import jwtMiddleware from "../middleware/jwt.middleware";
import { sendTestMail, sendVerificationMail } from "../utils/mailer";
import {
  getRedisValueByKey,
  setRedisValueByKey
} from "../utils/redis";
import { verificationCodeGenerator } from "../utils/random";

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

router.post("/verify", async (request: Request, response: Response) => {
  // TODO: generate Verification code
  const verificationCode = verificationCodeGenerator();
  // TODO: save code into redis with key
  // await setKey(`verification${result._id}`, verificationCode);
  // TODO: send Email with Verification code
  sendVerificationMail("juhyun.kim0204@gmail.com", verificationCode);
  try {
    return response.json({
      status: 200,
      data: {
        verificationCode,
        timestamp: new Date()
      }
    });
  } catch (error) {
    return response.json({ status: 400, error });
  }
});

router.post("/redis", async (request: Request, response: Response) => {
  const { key, value } = request.body;
  const result = await setRedisValueByKey(key, value);
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
  const { key } = request.query;
  const result = await getRedisValueByKey(key);
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
