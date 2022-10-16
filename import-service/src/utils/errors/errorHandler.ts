import { APIGatewayEvent, S3Event, SQSEvent } from "aws-lambda";
import { formatJsonApiSuccessResponse, formatJsonApiFailureResponse } from "../formatResponse";
export const errorHandler = <T>(
    callback: (event: APIGatewayEvent | S3Event | SQSEvent) => Promise<T>
) => {
    return async (event: APIGatewayEvent | S3Event | SQSEvent) => {
        try {
            console.log(event);
            const result = await callback(event);
            return formatJsonApiSuccessResponse(result);
        } catch (error) {
            console.error(error);
            return formatJsonApiFailureResponse(error);
        }
    };
};