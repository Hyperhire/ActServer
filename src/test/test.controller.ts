import { Request, Router, Response } from "express";
import multer from "multer";
import { uploadFile } from "../utils/upload";

const router = Router();
const upload = multer();

interface MulterRequest extends Request {
  file: any;
  files: any;
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

router.post(
  "/upload-images",
  uploadFile('test').array("images"),
  (request: MulterRequest, response: Response) => {
    try {
      console.log(request.files);
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
