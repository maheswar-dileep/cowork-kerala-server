import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { config } from "@config/env";
import { connectDB } from "@config/database";
import { errorHandler, notFound } from "@middlewares/error.middleware";
import { swaggerSpec } from "@config/swagger";

// Import routes
import authRoutes from "./routes/auth.routes";
import settingsRoutes from "./routes/settings.routes";
import uploadRoutes from "./routes/upload.routes";
import spaceRoutes from "./routes/space.routes";
import leadRoutes from "./routes/lead.routes";
import locationRoutes from "./routes/location.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: [...config.cors.origin, "http://localhost:8080"],
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Swagger API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "CoWork Kerala API Docs",
  })
);

// Swagger JSON endpoint
app.get("/api-docs.json", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/spaces", spaceRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/locations", locationRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
Environment: ${config.nodeEnv.padEnd(38)}
Port:        ${String(PORT).padEnd(38)}
CORS Origin: ${config.cors.origin.join(", ")}
Health:      http://localhost:${PORT}/health 
API Docs:    http://localhost:${PORT}/api-docs 
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

export default app;
