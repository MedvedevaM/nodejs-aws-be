import express from 'express';
import { router } from './routes';
import { BaseError } from './utils/errors';

const app: express.Application = express();

const PORT = 4000;
app.set('port', PORT);

// setup routes
router(app);

// default error handler
app.use(
    (error: Error, request: express.Request, response: express.Response, _next: express.NextFunction) => {
      const responseError = error instanceof BaseError ? error : new BaseError('Internal Server Error')
      response.status(responseError.status).send({
        name: responseError.name,
        message: responseError.message
      });
    }
);

app.listen(PORT, () => {
    console.log('Express server started');
});
