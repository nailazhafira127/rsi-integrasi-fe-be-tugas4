import express, { type Application } from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.ts';
import { closePool, getPool } from './db/pool.ts';
import { openApiDocument } from './docs/openapi.ts';
import { corsMiddleware } from './middlewares/cors.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { notFoundHandler } from './middlewares/notFound.ts';
import { originGuard } from './middlewares/originGuard.ts';
import { auditLogRouter } from './routes/auditLogRouter.ts';
import { authRouter } from './routes/authRouter.ts';
import { flagRouter } from './routes/flagRouter.ts';
import { likeRouter } from './routes/likeRouter.ts';
import { menuRouter } from './routes/menuRouter.ts';
import { reviewRouter } from './routes/reviewRouter.ts';
import { stallRouter } from './routes/stallRouter.ts';
import { userRouter } from './routes/userRouter.ts';

const app: Application = express();

app.disable('x-powered-by');
app.use(corsMiddleware);
app.use(originGuard);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.get('/api-docs/openapi.json', (_req, res) => {
  res.status(200).json(openApiDocument);
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: 'NyamNyam API Docs',
    swaggerOptions: {
      docExpansion: 'list',
      displayRequestDuration: true,
      tryItOutEnabled: true,
      withCredentials: true,
    },
  }),
);

app.get('/health', async (_req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query<{ ok: number }>('SELECT 1 AS ok');

    res.status(200).json({
      status: 'success',
      message: 'Server dan database terhubung',
      database: result.recordset[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check gagal:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal terhubung ke database',
    });
  }
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/stalls', stallRouter);
app.use('/api/v1/menu-items', menuRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/flags', flagRouter);
app.use('/api/v1/audit-logs', auditLogRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.port, () => {
  console.log(`Server berjalan di http://localhost:${env.port}`);
  console.log(`Dokumentasi API: http://localhost:${env.port}/api-docs`);
});

function shutdown(signal: string): void {
  console.log(`Menerima ${signal}. Menutup server...`);

  server.close(() => {
    void closePool().finally(() => {
      process.exit(0);
    });
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));