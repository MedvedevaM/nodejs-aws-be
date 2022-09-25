import { APIGatewayEvent } from "aws-lambda";
import { formatJsonApiSuccessResponse, formatJsonApiFailureResponse } from "../formatResponse";
export const errorHandler = <T>(
    callback: (event: APIGatewayEvent) => Promise<T>
) => {
    return async (event: APIGatewayEvent) => {
        try {
            const result = await callback(event);
            return formatJsonApiSuccessResponse(result);
        } catch (error) {
            return formatJsonApiFailureResponse(error);
        }
    };
};