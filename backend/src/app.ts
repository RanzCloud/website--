import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import { env } from "./config/env";

import auth from "./routes/auth.routes";
import products from "./routes/product.routes";
import settings from "./routes/settings.routes";
import checkout from "./routes/checkout.routes";
import admin from "./routes/admin.routes";
import dashboard from "./routes/dashboard.routes";
import payment from "./routes/payment.routes";
import provision from "./routes/provision.routes";

import { notFound, errorHandler } from "./middleware/error";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.frontendUrl || "*",
    credentials: true,
  })
);

app.use(compression());

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Homepage
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Ranz Panel API Running",
    version: "1.0.0",
  });
});

// Health Check
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    status: "online",
  });
});

// Routes
app.use("/api/auth", auth);

app.use("/api", products);
app.use("/api", settings);
app.use("/api", checkout);
app.use("/api", admin);
app.use("/api", dashboard);
app.use("/api", payment);
app.use("/api", provision);

// 404
app.use(notFound);

// Error Handler
app.use(errorHandler);

export default app;
