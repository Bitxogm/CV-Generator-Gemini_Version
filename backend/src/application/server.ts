import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import cvRoutes from './routes/cv.routes';

// Middlewares
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// Seguridad
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' })); // Para base64 de fotos
app.use(express.urlencoded({ extended: true }));

// Logging (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================
// RUTAS API
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cvs', cvRoutes);

// ============================================
// ERROR HANDLERS
// ============================================

// 404 - Not Found
app.use(notFoundHandler);

// Error global
app.use(errorHandler);

// ============================================
// INICIO DEL SERVIDOR
// ============================================

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log('╔══════════════════════════════════════════╗');
      console.log('║                                          ║');
      console.log('║       🚀 TalentHub API Server 🚀        ║');
      console.log('║                                          ║');
      console.log('╚══════════════════════════════════════════╝');
      console.log('');
      console.log(`📡 Server running on port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
      console.log('');
      console.log('📋 Available routes:');
      console.log('   - GET  /health');
      console.log('   - POST /api/auth/signup');
      console.log('   - POST /api/auth/signin');
      console.log('   - POST /api/profile');
      console.log('   - GET  /api/cvs');
      console.log('   - POST /api/cvs/:id/adapt');
      console.log('');
      console.log('✨ Ready to receive requests!');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();

export default app;
