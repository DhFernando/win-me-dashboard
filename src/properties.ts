export const BASE_MAIN_API_URL = `${process.env.REACT_APP_API_URL}/graphql`;

export const S3config = {
  bucketName: "winme-media",
  dirName: "products/",
  region: "ap-south-1",
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  s3Url: process.env.REACT_APP_S3_URL,
};

export const Websocket = {
  wsURL: process.env.REACT_APP_API_URL,
  topic1: "/join-room",
};
