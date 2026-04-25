import { CronService } from "../infrastructure/services/CronService";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import cvRoutes from "./routes/cv.routes";
import jobRoutes from "./routes/job.routes";

// Middlewares
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

// Cargar variables de entorno
dotenv.config();

const app: Application = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ============================================
// HEALTH CHECK
// ============================================

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================
// RUTAS API
// ============================================

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cvs", cvRoutes);
app.use("/api/jobs", jobRoutes);

// ============================================
// ERROR HANDLERS
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

export default app;