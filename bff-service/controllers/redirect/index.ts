import express from 'express';
import axios, { Method } from 'axios';
import { BaseError, MethodNotAllowedError, BadGatewayError, ErrorsMapper } from '../../utils/errors';

const allowedMethods: Method[] = ['GET', 'POST', 'PUT', 'DELETE'];

export const redirect = async (request: express.Request) => {
    const { body, originalUrl } = request;
    const method = request.method as Method;
    if (!method || !allowedMethods.includes(method)) {
        throw new MethodNotAllowedError('Provided HTTP method is not allowed');
    }
    const response = await axios({
        method,
        url: getUrl(originalUrl),
        data: body,
        validateStatus: () => true,
    });

    if (response.status !== 200) {
        const Error = ErrorsMapper[response.status] || BaseError;
        throw new Error(response.data.message, response.status);
    }
    return response.data;
};

function getUrl(originalUrl: string): string | undefined {
    let url: string | undefined;
    if (originalUrl.startsWith('/products')) {
        url = process.env.products;
    }

    if (originalUrl.startsWith('/cart')) {
        url = process.env.cart;
    }
    
    if (!url) {
        throw new BadGatewayError('Cannot process request');
    }
    return `${url}${originalUrl}`;
}