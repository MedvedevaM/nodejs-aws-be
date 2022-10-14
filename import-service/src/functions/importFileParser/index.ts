import { APIGatewayProxyHandler, S3Event } from "aws-lambda";
import { S3 } from "aws-sdk";
import { errorHandler } from "@errors/errorHandler";
const csv = require("csv-parser");

export const importFileParser = async (event: S3Event): Promise<void> => {
  for (const record of event.Records) {
    const { key } = record.s3.object;
    const s3 = new S3({ region: 'eu-west-1' });
    const BUCKET_NAME = 'rss-import-service';
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };
    const s3Stream = s3.getObject(params).createReadStream();

    const result = await new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv())
        .on('error', error => reject(error))
        .on('data', row => console.log(row))
        .on('end', async () => {
          await s3.copyObject(mapCopyParams(BUCKET_NAME, key)).promise();
          await s3.deleteObject(params).promise();
          resolve(`Read stream of ${key} file is ended, file is moved to 'parsed' folder`);
        });
    });
    console.log(result);
  }
};

const mapCopyParams = (bucketName, initialKey) => {
  return {
    Bucket: bucketName,
    CopySource: `${bucketName}/${initialKey}`,
    Key: initialKey.replace('uploaded', 'parsed')
  }
};

export const handler: APIGatewayProxyHandler = errorHandler<void>(importFileParser);