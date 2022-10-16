import { APIGatewayProxyHandler, S3Event } from "aws-lambda";
import { SQS, S3 } from "aws-sdk";
import { errorHandler } from "@errors/errorHandler";
const csv = require("csv-parser");

const SQS_QUEUE = process.env.SQS_QUEUE;

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

    const sqs = new SQS();

    const products = [];
    const result = await new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv({ separator: ';' }))
        .on('error', error => reject(error))
        .on('data', async (row) => {
          products.push(row);
        })
        .on('end', async () => {
          resolve(`Read stream of ${key} file is ended, products are published to SQS queue`);
        });
    });
    console.log(result);

    for (const product of products) {
      const sqsResult = await sqs.sendMessage({
        QueueUrl: SQS_QUEUE,
        MessageBody: JSON.stringify(product)
      }).promise();
      console.log(`SQS result: ${JSON.stringify(sqsResult)}`);
    }
  }
};

export const handler: APIGatewayProxyHandler = errorHandler<void>(importFileParser);