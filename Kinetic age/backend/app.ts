import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import serviceRoutes from './routes/serviceRoutes';
import slotRoutes from './routes/slotRoutes';
import bookingRoutes from './routes/bookingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();

// Trust reverse proxy for Cloud Run and express-rate-limit
app.set('trust proxy', 1);

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled to allow Vite HMR and inline styles in preview
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'KineticAge Senior Wellness Platform',
    timestamp: new Date().toISOString(),
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
