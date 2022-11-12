import { Status } from './http-status'

export class BaseError extends Error {
    status: Status;
    constructor(message: string, status?: Status) {
        super(message);
        this.name = 'InternalError';
        this.status = status || Status.INTERNAL_SERVER_ERROR;
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.status = Status.NOT_FOUND;
    }
}

export class MethodNotAllowedError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'MethodNotAllowedError';
        this.status = Status.METHOD_NOT_ALLOWED;
    }
}

export class BadRequestError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
        this.status = Status.BAD_REQUEST;
    }
}

export class BadGatewayError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'BadGatewayError';
        this.status = Status.BAD_GATEWAY;
    }
}

export const ErrorsMapper: {
    [status: number]: typeof BaseError
} = {
    [Status.BAD_REQUEST]: BadRequestError,
    [Status.NOT_FOUND]: NotFoundError,
    [Status.METHOD_NOT_ALLOWED]: MethodNotAllowedError,
    [Status.INTERNAL_SERVER_ERROR]: BaseError,
    [Status.BAD_GATEWAY]: BadGatewayError,
};

