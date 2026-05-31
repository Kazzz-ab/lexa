import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import attorneyRoutes from './routes/attorneys.js';
import caseRoutes from './routes/cases.js';
import invoiceRoutes from './routes/invoices.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'CounselFlow' }));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/attorneys', attorneyRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/invoices', invoiceRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`CounselFlow API running on port ${PORT}`));
});
