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
import notificationRoutes from './routes/notifications.js';
import analyticsRoutes from './routes/analytics.js';
import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';
import { auditLog } from './middleware/audit.js';
import { speedLimiter, writeLimiter, sanitizeInput, antiPhishingHeaders, honeypotCheck, duplicateSubmissionBlock } from './middleware/security.js';

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
app.use(auditLog);
app.use(speedLimiter);
app.use(sanitizeInput);
app.use(antiPhishingHeaders);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' },
});

app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'Lexa' }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/attorneys', attorneyRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Lexa API running on port ${PORT}`));

process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });
