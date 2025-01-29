import { Response, Request, Router } from "express";

import authRouter from "./auth";
import Middleware from "../controller/Middleware";
import productRouter from "./product";

const router = Router();

router.get("/", (req: Request, res: Response) =>
  res.send("You're live <a href='/docs'>docs</a>")
);
router.use("/auth", authRouter);
router.use("/product",Middleware.isAuthenticated, productRouter);

export default router;
