// @aws-sdk/client-s3
import { S3Client } from "@aws-sdk/client-s3";

export const createS3Client = () => {
  const client = new S3Client({
    region: process.env.MY_AWS_REGION || "",
    credentials: {
      accessKeyId: process.env.MY_AWS_ACCESS_KEY || "",
      secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true,
  });

  return client;
};
