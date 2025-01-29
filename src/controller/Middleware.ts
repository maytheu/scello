/**
 * check user authication and authorization level
 * created by @maytheu
 */

import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

import AppError from "../service/AppError";
import { env } from "../config/validate";
import { Role } from "../interface/utils.types";
import { prisma } from "../server";

interface IUserPayload {
  id: string;
  role: number;
}

class Middleware {
  /**
   * Verify the user token/session before fetching resources
   * @param req
   * @param res
   * @param next
   * @returns
   */
  isAuthenticated: RequestHandler = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return next(new AppError("Please login to access this resource", 401));
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const verify = jwt.verify(token, env.SECRET_KEY);
      const payload = <IUserPayload>verify;
      if (payload?.id) {
        req.user = verify;
        return next();
      } else
        return next(new AppError("Please login to access this resource", 401));
    }
  };

  /**
   * Validates user state based on role
   * @param level - defines the role of the user
   * @returns
   */
  authorize = (level: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = <IUserPayload>req.user;
        const admin = await prisma.role.findUnique({
          where: { id: user?.role },
          select: { name: true },
        });
        if (!admin) return next(new AppError("You lost your way", 403));
        if(!level.includes(admin.name as any))
          return next(new AppError("Unauthorized", 403));

        return next();
      } catch (error) {
        next(error);
      }
    };
  };
}

export default new Middleware();
