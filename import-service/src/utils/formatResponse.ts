import {
    BaseError
} from "./errors";

const formatJsonApiResponse = <T>(response: T | Error, statusCode = 200) => {
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        statusCode,
        body: JSON.stringify(response),
    }
}

export const formatJsonApiSuccessResponse = <T>(response: T) => {
    return formatJsonApiResponse(response);
}

export const formatJsonApiFailureResponse = (error: Error) => {
    const responseError = error instanceof BaseError ? error : new BaseError('Internal Server Error');
    return formatJsonApiResponse({
        name: responseError.name,
        message: responseError.message
    }, responseError.status);
}