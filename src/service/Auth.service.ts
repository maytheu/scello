import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../server";
import AppError from "./AppError";
import Helpers from "./Helpers";
import { wrongCredentials } from "../controller/errorHandler";
import { env } from "../config/validate";
import { ISignup } from "../interface/user.interface.";

class AuthService {
  signup = async (data: ISignup) => {
    try {
      const isUser = await this.checkUniqueEmail(data.email);
      if (isUser) return new AppError("Account already exist", 400);

      const hashPasssword = await this.encryptPassword(data.password);
      data.password = hashPasssword;

      const roleId = await Helpers.getRoleIdByName("user");

      const user = await prisma.user.create({
        data: { ...data, roleId },
        select: { id: true },
      });
      return jwt.sign({ id: user.id, role: roleId }, env.SECRET_KEY, {
        expiresIn: "90d",
      });
    } catch (error: any) {
      return error;
    }
  };

  signin = async (email: string, password: string) => {
    try {
      const user = await this.checkUniqueEmail(email, {
        password: true,
        email: true,
        roleId: true,
      });
      if (!user) return wrongCredentials();

      const comparePassword = await this.comparePassword(
        password,
        user.password
      );
      if (!comparePassword) return wrongCredentials();
      return jwt.sign({ id: user.id, role: user.roleId }, env.SECRET_KEY, {
        expiresIn: "90d",
      });
    } catch (error) {
      return error;
    }
  };

  checkUniqueEmail = async (
    email: string,
    select: object = { email: true, id: true }
  ): Promise<any | null> => {
    return await prisma.user.findUnique({ where: { email }, select });
  };

  private comparePassword = async (
    password: string,
    hash: string
  ): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  };

  private encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
}

export default new AuthService();
