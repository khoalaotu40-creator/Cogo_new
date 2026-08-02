import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import locationsRouter from "./server/api/locations";
import authRouter from "./server/api/auth";
import ridesRouter from "./server/api/rides";
import postsRouter from "./server/api/posts";
import usersRouter from "./server/api/users";
import vehiclesRouter from "./server/api/vehicles";
import tripsRouter from "./server/api/trips";
import tripSegmentsRouter from "./server/api/trip_segments";
import transactionsRouter from "./server/api/transactions";
import walletsRouter from "./server/api/wallets";
import { initDb } from "./server/db";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  await initDb();

  // Middleware
  app.use(express.json({ limit: '50mb' }));

  // API routes
  app.use("/api/locations", locationsRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/rides", ridesRouter);
  app.use("/api/posts", postsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/vehicles", vehiclesRouter);
  app.use("/api/trips", tripsRouter);
  app.use("/api/trip-segments", tripSegmentsRouter);
  app.use("/api/transactions", transactionsRouter);
  app.use("/api/wallets", walletsRouter);
  
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
