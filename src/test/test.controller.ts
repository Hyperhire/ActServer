import { Request, Router, Response } from "express";
import multer from "multer";
import KasWallet from "../utils/kasWallet";
import { getRedisValueByKey } from "../utils/redis";
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
                timestamp: new Date(),
            },
        });
    } catch (error) {
        return response.json({ status: 400, error });
    }
});

router.get("/redis", async (request: Request, response: Response) => {
    try {
        const value = await getRedisValueByKey("hello");
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

router.post(
    "/upload-images",
    uploadFile("test").fields([
        { name: "logo", maxCount: 1 },
        { name: "images", maxCount: 3 },
    ]),
    (request: MulterRequest, response: Response) => {
        try {
            console.log(request.files);
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
    }
);

//TODO: form data 처리하는게 이슈네
router.post(
    "/register-nft-image",
    uploadFile("notice").single("image"),
    async (request: MulterRequest, response: Response) => {
        try {
            const file = request?.file;
            console.log("file", file);
            if (!file) {
                throw "no image";
            }
            // const image = KasWallet.registerNftImage(file);
            // return response.status(201).json({
            //   data: {
            //     text: "register NFT",
            //     timestamp: new Date(),
            //     image
            //   }
            // });
        } catch (error) {
            return response.status(400).json({ error });
        }
    }
);

export default router;
