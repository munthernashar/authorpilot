import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './common/middleware.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { personasRouter } from './modules/personas/personas.routes.js';
import { booksRouter } from './modules/books/books.routes.js';
import { chaptersRouter } from './modules/chapters/chapters.routes.js';
import { uploadsRouter } from './modules/uploads/uploads.routes.js';
import { jobsRouter } from './modules/jobs/jobs.routes.js';
import { imagesRouter } from './modules/images/images.routes.js';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'authorpilot-api' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/personas', personasRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/books', booksRouter);
app.use('/api/v1', chaptersRouter);
app.use('/api/v1/uploads', uploadsRouter);
app.use('/api/v1/jobs', jobsRouter);
app.use('/api/v1', imagesRouter);

app.use(errorHandler);
