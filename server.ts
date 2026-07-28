import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import locationsRouter from "./server/api/locations";
import authRouter from "./server/api/auth";
import ridesRouter from "./server/api/rides";
import { initDb } from "./server/db";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  await initDb();

  // Middleware
  app.use(express.json());

  // API routes
  app.use("/api/locations", locationsRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/rides", ridesRouter);
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
