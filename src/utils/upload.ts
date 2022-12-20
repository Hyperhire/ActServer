const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const uploadFile = folder =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: "doact-dev",
      acl: "public-read",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        console.log('file inside multer is', file)
        return cb(null, `${folder}/${Date.now()}_${file.originalname}`);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 5
    }
  });

const getBuckets = async () => {
  await s3.listBuckets((err, data) => {
    if (err) {
      console.log("error", err);
    } else {
      console.log("success", data);
      return data.Buckets;
    }
  });
};

export { getBuckets, uploadFile };
