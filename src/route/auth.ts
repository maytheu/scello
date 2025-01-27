import { Router } from "express";

import AuthController from "../controller/Auth.controller";
import passport from "passport";
import Middleware from "../controller/Middleware";

const authRouter = Router();

authRouter.post("/register", AuthController.signup);
authRouter.post("/login", AuthController.signin);

export default authRouter;
