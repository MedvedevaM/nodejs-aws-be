import { Status } from '../http/status'

export class BaseError extends Error {
    status: Status;
    constructor(message: string) {
        super(message);
        this.name = 'InternalError';
        this.status = Status.INTERNAL_SERVER_ERROR;
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.status = Status.NOT_FOUND;
    }
}

export class BadRequestError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
        this.status = Status.BAD_REQUEST;
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
        this.status = Status.UNAUTHORIZED;
    }
}

export class ForbiddenError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'ForbiddenError';
        this.status = Status.FORBIDDEN;
    }
}

