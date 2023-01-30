import { config } from "./../config/config";
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: config.AWS_ACCESS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  }
});

const uploadFile = folder =>
  multer({
    storage: multerS3({
      s3,
      bucket: config.AWS_S3_BUCKET,
      acl: "public-read",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        console.log("file inside multer is", file);
        return cb(null, `${folder}/${Date.now()}_${file.originalname}`);
      }
    }),
    limits: {
      fileSize: config.AWS_S3_IMAGE_LIMIT
    }
  });

export { uploadFile };
