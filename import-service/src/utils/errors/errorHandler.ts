import { APIGatewayEvent, S3Event } from "aws-lambda";
import { formatJsonApiSuccessResponse, formatJsonApiFailureResponse } from "../formatResponse";
export const errorHandler = <T>(
    callback: (event: APIGatewayEvent | S3Event) => Promise<T>
) => {
    return async (event: APIGatewayEvent | S3Event) => {
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