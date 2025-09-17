import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { spawn } from "child_process";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite in development, otherwise serve static
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT from env or fallback to 5000
  const port = parseInt(process.env.PORT || "5000", 10);

  // ✅ Don’t force "0.0.0.0" on Windows — just use localhost
  // Start Python ML service
  const pythonBackendPath = path.join(process.cwd(), "client", "src", "Backend");
  const pythonProcess = spawn("python", ["main.py"], {
    cwd: pythonBackendPath,
    stdio: "pipe"
  });

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python service: ${data.toString().trim()}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python service error: ${data.toString().trim()}`);
  });

  log("Starting Python ML service...");

  server.listen(port, () => {
    log(`Server running at http://localhost:${port}`);
  });
})();
