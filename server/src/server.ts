import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { prerenderSeoMiddleware } from './middleware/prerenderSeo.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false // Allow inline scripts and assets for dynamic preview
  })
);

// CORS
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching origin
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === clientOrigin) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

app.use(compression());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static Uploads Directory
const uploadsPath = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadsPath));

// SEO Bot Crawler Prerender Interceptor
app.use(prerenderSeoMiddleware);

// Rate Limiter for Public Inquiries / Forms (prevents abuse)
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { success: false, message: 'Too many requests submitted. Please try again in a few minutes.' }
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/public/inquiries', inquiryLimiter);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/admin', adminRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'HangingPanda CMS Core API',
    version: '1.0.0'
  });
});

// 404 Handler for APIs
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Endpoint not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
export const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const { User } = await import('./models/User.js');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is empty. Running initial content seed automatically...');
      const { seedData } = await import('./scripts/seed.js');
      await seedData();
    }

    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 HangingPanda Backend API Server running on port ${PORT}`);
      console.log(`   Healthcheck: http://localhost:${PORT}/api/health`);
      console.log(`   Public APIs: http://localhost:${PORT}/api/v1/public`);
      console.log(`   Admin APIs:  http://localhost:${PORT}/api/v1/admin`);
      console.log(`=======================================================`);
    });
    return server;
  } catch (error: any) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Auto-start when executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
