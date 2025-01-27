import { Response, Request, Router } from "express";

import authRouter from "./auth";
import Middleware from "../controller/Middleware";

const router = Router();

router.get("/", (req: Request, res: Response) => res.send("You're live"));
router.use("/auth", authRouter);

export default router;
