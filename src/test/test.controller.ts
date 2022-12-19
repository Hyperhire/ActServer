import { Request, Router, Response } from "express";
import KasWallet from "../utils/kasWallet";
import multer from "multer";
import { getBuckets, uploadFile } from "../utils/upload";

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

router.post("/upload-image", uploadFile.single('file'), async (request: MulterRequest, response: Response) => {
  const file = request?.file
  if (!file) {
    throw 'no image';
  }
  response.json({
    status: 201,
    data: {
      text: "upload image",
      url: file.location,
      timestamp: new Date()
    }
  });
});

// router.post('/get-s3-buckets', (request:Request, response: Response) => {
//   try {

//     const buckets = getBuckets();
//     return response.status(201).json({
//       data: buckets
//     })
//   } catch (error) {
//     return response.status(400).json({
//       error
//     })
//   }
// })

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

export default router;
