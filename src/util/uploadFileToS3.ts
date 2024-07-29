import AWS from "aws-sdk";
import { S3config } from "../properties";
import uuid from "react-uuid";

const S3_BUCKET = S3config.bucketName;
const REGION = S3config.region;

AWS.config.update({
  accessKeyId: S3config.accessKeyId,
  secretAccessKey: S3config.secretAccessKey,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export const uploadFileToS3 = (file, location) => {
  return new Promise((resolve, reject) => {
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: `${location}/${uuid()}.png`,
    };
    myBucket.putObject(params, function (err, data) {
      if (err) {
        const error = {
          status: "error",
          message: "Error uploading data",
        };
        reject(error);
      } else {
        const success = {
          status: "success",
          message: "Successfully uploaded data",
          Key: params.Key,
        };
        resolve(success);
      }
    });
  });
};
