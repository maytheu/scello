import { RequestHandler } from "express";
import AuthService from "../service/Auth.service";
import passport from "passport";

import { ILogin, LoginDTO, SignupDTO } from "../interface/user.interface.";
import Controller from "./Controller";
import AppError from "../service/AppError";

class AuthController extends Controller {
  /**
   * handle new user, with email
   * @param req
   * @param res
   * @param next
   */
  signup: RequestHandler = async (req, res, next) => {
    try {
      SignupDTO.parse(req.body);
      const data = await AuthService.signup(req.body);
      if (data instanceof AppError || data instanceof Error) return next(data);

      return this.sendCreatedResp(res, "Account created successfully", {
        token: data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * sign in user based on login method
   * @param req
   * @param res
   * @param next
   */
  signin: RequestHandler = async (req, res, next) => {
    try {
      LoginDTO.parse(req.body);
      
      const data = await AuthService.signin(req.body.email, req.body.password);
      if (data instanceof AppError || data instanceof Error) return next(data);

      this.sendResp(res, "User login successfull", { token: data });
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
