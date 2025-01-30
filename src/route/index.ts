import { Response, Request, Router } from "express";

import authRouter from "./auth";
import Middleware from "../controller/Middleware";
import productRouter from "./product";

const router = Router();

router.use("/auth", authRouter);
router.use("/product",Middleware.isAuthenticated, productRouter);

export default router;
