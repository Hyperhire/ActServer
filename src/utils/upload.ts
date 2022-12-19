// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const AWS = require("aws-sdk");

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: "ap-northeast-2"
// });

// const s3 = new AWS.S3({ apiVersion: "2010-03-31" });

// const uploadFile = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "doact-dev",
//     acl: "public-read",
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
//   })
// });

// const getBuckets = async () => {
//   await s3.listBuckets((err, data) => {
//     if (err) {
//       console.log("error", err);
//     } else {
//       console.log("success", data);
//       return data.Buckets;
//     }
//   });
// };

// // const uploadFile = async file => {
// //   try {
// //     const fs = require("fs");
// //     const fileStream = fs.createReadStream(file);
// //     fileStream.on("error", function(err) {
// //       console.log("File Error", err);
// //     });
// //     const uploadParams = { Bucket: "doact-dev", Key: "", Body: "" };
// //     uploadParams.Body = fileStream;
// //     uploadParams.Key = "testtest";
// //     await s3.upload(uploadParams, (err, data) => {
// //       if (err) {
// //         console.log("error", err);
// //         throw err;
// //       }
// //       if (data) {
// //         console.log("Upload Success", data);
// //       }
// //     });
// //   } catch (error) {
// //     throw error;
// //   }
// // };

// export { getBuckets, uploadFile };
