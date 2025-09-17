// server/index.ts
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from "dotenv";

// Load .env variables (e.g., GEMINI_API_KEY, PORT)
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ----------------------
// Logging middleware
// ----------------------
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  // @ts-ignore capture outgoing JSON response
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    // @ts-ignore forward call
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch {
          logLine += ` :: [response-not-serializable]`;
        }
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// ----------------------
// Bootstrap async
// ----------------------
(async () => {
  const server = await registerRoutes(app);

  // ----------------------
  // Error handling middleware
  // ----------------------
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    // Re-throw for visibility in dev logs
    throw err;
  });

  // ----------------------
  // Setup Vite (dev) or static (prod)
  // ----------------------
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ----------------------
  // Start HTTP server
  // ----------------------
  const port = parseInt(process.env.PORT || "5000", 10);

  server.listen(port, () => {
    log(`Server running at http://localhost:${port}`);
    if (process.env.GEMINI_API_KEY) {
      log("✅ GEMINI_API_KEY detected");
    } else {
      log("⚠️  GEMINI_API_KEY not set — fallback predictions will fail");
    }
  });
})();
