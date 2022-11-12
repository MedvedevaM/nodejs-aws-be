import express from 'express';
import { errorHandler } from '../utils/errorHandler';
import { redirect } from '../controllers/redirect';
import { AxiosResponse } from 'axios';

export const router: express.Router = express.Router();

router.all('/*', errorHandler<AxiosResponse>(redirect));
