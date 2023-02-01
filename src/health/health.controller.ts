import { Request, Router, Response } from "express";
import multer from "multer";
import KasWallet from "../utils/kasWallet";
import { getRedisValueByKey } from "../utils/redis";
import { uploadFileToS3 } from "../utils/upload";

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
                timestamp: new Date(),
            },
        });
    } catch (error) {
        return response.json({ status: 400, error });
    }
});


export default router;
