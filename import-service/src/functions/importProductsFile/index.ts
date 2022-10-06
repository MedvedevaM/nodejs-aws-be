import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import { errorHandler } from "@errors/errorHandler";

export const importProductsFile = async (event: APIGatewayProxyEvent): Promise<string> => {
  const { name: fileName } = event.queryStringParameters;

  const s3 = new S3({ region: 'eu-west-1' });
  const BUCKET_NAME = 'rss-import-service';
  const params = {
    Bucket: BUCKET_NAME,
    Key: `uploaded/${fileName}`,
    Expires: 60,
    ContentType: 'text/csv'
  };
  const signedUrl: string = await s3.getSignedUrlPromise('putObject', params);

  return signedUrl;
};

export const handler: APIGatewayProxyHandler = errorHandler<string>(importProductsFile);