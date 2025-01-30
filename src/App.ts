import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import rateLimit from "express-rate-limit";

import AppError from "./service/AppError";
import globalErrorHandler from "./controller/errorHandler";
import router from "./route";
import { env } from "./config/validate";
import swaggerSpec from "./swaggger";
import hpp from "hpp";
import helmet from "helmet";

class App {
  app!: Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.route();
    this.errorHandler();
  }

  private middleware() {
    const limiter = rateLimit({
      windowMs: 100 * 60 * 1000,
      max: 500,
      message: "Too many request",
    });
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(limiter);
    this.app.use(express.json());
    this.app.use(hpp());
  }

  private route() {
    router.get("/", (req: Request, res: Response) =>
      res.send("You're live <a href='/docs'>docs</a>")
    );
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.app.get("/docs.json", (req: Request, res: Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });
    this.app.use("/api/v1", router);
  }

  private errorHandler() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(
        new AppError(`Ooops.. ${req.originalUrl} not found on this server`, 404)
      );
    });
    this.app.use(globalErrorHandler);
  }
}

export default new App();
