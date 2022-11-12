import express from 'express';

export const errorHandler = <T>(
    callback: (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => Promise<T>
) => {
    return async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const result: T = await callback(request, response, next);
            response.send(result);
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
};
