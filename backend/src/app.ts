import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import sentimentRoutes from './routes/sentimentRoutes';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    '/',
    express.static(new URL('../../frontend/public', import.meta.url).pathname)
);

app.use('/content', sentimentRoutes);

export default app;
