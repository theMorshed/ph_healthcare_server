import express, { Application, json, Request, Response, urlencoded } from 'express';
import cors from 'cors';
import { userRoutes } from './app/modules/user/user.routes';
import { adminRoutes } from './app/modules/admin/admin.routes';

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

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);

export default app;