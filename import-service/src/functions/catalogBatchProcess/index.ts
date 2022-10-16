import { SQSEvent } from "aws-lambda";
import { errorHandler } from "@errors/errorHandler";
import { createProduct } from "./createProduct";
import { SNS } from "aws-sdk";

export const catalogBatchProcess = async (event: SQSEvent): Promise<void> => {
  const sns = new SNS({ region: "eu-west-1" });
  for (const record of event.Records) {
    const product = JSON.parse(record.body);
    await createProduct(product);

    const snsResponse = await sns.publish({
      Subject: "New arrival",
      Message: JSON.stringify(product),
      TopicArn: process.env.SNS_TOPIC,
      ..._getMessageAttribute(product)
    }).promise();
    console.log(`SNS response: ${JSON.stringify(snsResponse)}`);
  }
};

const _getMessageAttribute = (product) => product.title === "Special Product" ? {
  MessageAttributes: {
    "title": {
      DataType: "String",
      StringValue: "Special"
    },
  }
} : {};

export const handler = errorHandler<void>(catalogBatchProcess);