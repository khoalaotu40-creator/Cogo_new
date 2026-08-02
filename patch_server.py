with open('server.ts', 'r') as f:
    content = f.read()

imports = """import vehiclesRouter from "./server/api/vehicles";
import tripsRouter from "./server/api/trips";
import tripSegmentsRouter from "./server/api/trip_segments";
import transactionsRouter from "./server/api/transactions";
import walletsRouter from "./server/api/wallets";"""

content = content.replace('import vehiclesRouter from "./server/api/vehicles";', imports)

routes = """  app.use("/api/vehicles", vehiclesRouter);
  app.use("/api/trips", tripsRouter);
  app.use("/api/trip-segments", tripSegmentsRouter);
  app.use("/api/transactions", transactionsRouter);
  app.use("/api/wallets", walletsRouter);"""

content = content.replace('  app.use("/api/vehicles", vehiclesRouter);', routes)

with open('server.ts', 'w') as f:
    f.write(content)
