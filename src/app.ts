import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:4200'
}));

export default app;
