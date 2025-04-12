import express, { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import cors from 'cors';
import router from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { StatusCodes } from 'http-status-codes';

const app: Application = express();

app.use(cors());

// parser
app.use(json());
app.use(urlencoded({extended: true}));

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Hello from Healthcare Application'
    })
});

app.use('/api/v1', router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'API NOT FOUND!!',
        error: {
            path: req.originalUrl,
            message: 'Your requested path is not found!'
        }
    })
})

export default app;