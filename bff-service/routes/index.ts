import express from 'express';
import { router as redirectRouter } from './redirect';

export const router = (app: express.Application): void => {
    app.use('/', redirectRouter);
};
