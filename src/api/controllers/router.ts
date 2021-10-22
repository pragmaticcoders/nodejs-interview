import express from "express";
import cors from "cors";
import logger from "app/utils/logger";
import { wrap } from "app/utils/express";
import { errorsMiddleware } from "app/api/middlewares/errors-middleware";
import { healthCheckController } from "app/api/controllers/health-check-controller";
import { AppServices } from "app/app-services";

export async function buildRouter(services: AppServices) {
  logger.debug("Building app router");
  // ---
  // start middlewares
  // ---

  const app = express();
  app.use(
    cors({
      origin: "*",
      optionsSuccessStatus: 200,
    })
  );

  // ---
  // routes
  // ---
  app.use("/health", express.json(), wrap(healthCheckController(services)));

  // ---
  // end middlewares
  // ---
  app.use(errorsMiddleware());

  return app;
}
