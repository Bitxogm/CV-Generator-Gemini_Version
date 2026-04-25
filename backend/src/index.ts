import app from './application/server';
import { CronService } from './infrastructure/services/CronService';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log("╔══════════════════════════════════════════╗");
      console.log("║                                          ║");
      console.log("║       🚀 TalentHub API Server 🚀        ║");
      console.log("║                                          ║");
      console.log("╚══════════════════════════════════════════╝");
      console.log("");
      console.log(`📡 Server running on port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("");

      // Iniciar cron jobs
      const cronService = new CronService();
      cronService.start();
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

// Manejo de errores
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

// Solo arrancar si se ejecuta directamente (no en tests)
if (require.main === module) {
  startServer();
}