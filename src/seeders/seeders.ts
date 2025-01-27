import bcrypt from "bcryptjs";
import { IName } from "../interface/user.interface.";

const salt = bcrypt.genSaltSync(10);

export const adminData = [
  {
    email: "maytheuhaydey@gmail.com",
    name: "Admin Maytheu",
    password: bcrypt.hashSync("@@12&&1", salt),
    roleId: 3,
  },
];

export const roleData: IName[] = [
  { name: "user" },
  { name: "admin" },
  { name: "super-admin" },
];
