import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import prisma from './lib/prisma.js';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import attorneyRoutes from './routes/attorneys.js';
import caseRoutes from './routes/cases.js';
import invoiceRoutes from './routes/invoices.js';
import statsRoutes from './routes/stats.js';
import { errorHandler } from './middleware/errorHandler.js';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET env var is required');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL env var is required');

const app = express();
const PORT = process.env.PORT || 4001;
const isProd = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || false,
  credentials: true,
}));
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '50kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' },
});

app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'CounselFlow' }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/attorneys', attorneyRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`CounselFlow API running on port ${PORT}`));

process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });
