import { Request, Router, Response } from "express";
import multer from "multer";
import { sendTestMail, sendVerificationMail } from "../utils/mailer";
import {
  getRedisValueByKey,
  setRedisValueByKeyWithExpireSec
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
  sendVerificationMail("juhyun.kim0204@gmail.com", "hello");
  try {
    return response.json({
      status: 200,
      data: {
        code: "hello",
        timestamp: new Date()
      }
    });
  } catch (error) {
    return response.json({ status: 400, error });
  }
});

router.post("/redis", async (request: Request, response: Response) => {
  const { key, value } = request.body;
  const result = await setRedisValueByKeyWithExpireSec(key, value, 10);
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
