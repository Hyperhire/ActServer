import { Request, Router, Response } from "express";
import KasWallet from "../utils/kasWallet";
import multer from "multer";
import { getBuckets, uploadFile } from "../utils/upload";
import { kakaopayRequestSubcriptionPayment } from "../utils/kakaopay";

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

router.get("/test", (request: Request, response: Response) => {
  try {
    return response.json({
      status: 200,
      data: {
        text: "test2",
        timestamp: new Date()
      }
    });
  } catch (error) {
    return response.json({ status: 400, error });
  }
});

router.post(
  "/",
  uploadFile("images").single("file"),
  (request: MulterRequest, response: Response) => {
    try {
      response.json({
        status: 200,
        data: {
          text: "hello, this is conan from hyperhire",
          timestamp: new Date()
        }
      });
    } catch (error) {
      return response.json({ status: 400, error });
    }
  }
);

router.post(
  "/kakao-subscription-payment",
  (request: Request, response: Response) => {
    try {
      const { id } = request.body;
      console.log("id", id);
      // await kakaopayRequestSubcriptionPayment();

      return response.json({
        status: 200,
        data: {
          text: "kakao subscription payment test",
          timestamp: new Date()
        }
      });
    } catch (error) {
      return response.status(400).send({ error });
    }
  }
);

router.post(
  "/upload-image",
  uploadFile("images").single("file"),
  async (request: MulterRequest, response: Response) => {
    try {
      const file = request.file;
      if (!file) {
        throw "no image";
      }
      return response.json({
        status: 201,
        data: {
          text: "upload image",
          url: file.location,
          timestamp: new Date()
        }
      });
    } catch (error) {
      return response.status(400).send({ error });
    }
  }
);

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
