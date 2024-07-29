import AWS from "aws-sdk";
import { S3config } from "../properties";

AWS.config.update({
  accessKeyId: S3config.accessKeyId,
  secretAccessKey: S3config.secretAccessKey,
  region: S3config.region,
});

const s3 = new AWS.S3();

export const getImageFromS3 = (fileName) => {
  var promise = s3.getSignedUrlPromise("getObject", {
    Bucket: S3config.bucketName,
    Key: fileName,
  });
  promise.then(function(url) {
    return url;
  }, function(err) { console.log(err) });
};
