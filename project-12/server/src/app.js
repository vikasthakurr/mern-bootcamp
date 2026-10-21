import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { mountSwagger } from "./config/swagger.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mountSwagger(app);

app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the TalentBridge API",
    docs: "/api/docs",
    health: "/api/health",
  });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
