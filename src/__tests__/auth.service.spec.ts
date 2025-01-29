import { prismaMock } from "../../singleton";
import { ISignup } from "../interface/user.interface.";
import AuthService from "../service/Auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Helpers from "../service/Helpers";

describe("AuthService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("signup()", () => {
    const sut = AuthService.signup;
    const data: ISignup = {
      email: "users@example.com",
      name: "Test User",
      password: "userPass123",
    };
    it("Should return if account already exist", async () => {
      const mockUser = {
        email: data.email,
        id: 1,
        name: "test",
        password: "",
        roleId: 2,
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const expected = await sut(data);

      expect(expected.toString()).toBe("Error: Account already exist");
    });

    it("Should create new account", async () => {
      const mockHashPassword = "hash password";
      const mockToken = "user token";
      const mockRoleId = 1;
      const mockUser = {
        email: data.email,
        id: 1,
        name: "test",
        password: mockHashPassword,
        roleId: 1,
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      jest.spyOn(Helpers, "getRoleIdByName").mockResolvedValue(mockRoleId);
      prismaMock.user.create.mockResolvedValue(mockUser);
      jest.spyOn(jwt, "sign").mockResolvedValue(mockToken as never);

      const expected = await sut(data);

      expect(expected).toBe(mockToken);
    });

    it("Should return error in catch {}", async () => {
      const error = new Error("Error occured");

      prismaMock.user.findUnique.mockRejectedValue(error);

      const expected = await sut(data);

      expect(expected.toString()).toBe("Error: Error occured");
    });
  });

  describe("signin()", () => {
    const email = "user@example.com";
    const password = "user12345";
    const sut = AuthService.signin;
    it("Should return error if account not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const expected: any = await sut(email, password);

      expect(expected.toString()).toBe("Error: Login credentials do not match");
    });

    it("Should return error if password do not match", async () => {
      const mockUser = {
        email,
        id: 1,
        name: "test",
        password: "mockHashPassword",
        roleId: 1,
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

      const expected: any = await sut(email, password);

      expect(expected.toString()).toBe("Error: Login credentials do not match");
    });

    it("Should log in user", async()=>{
      const mockUser = {
        email,
        id: 1,
        name: "test",
        password: "mockHashPassword",
        roleId: 1,
      };
      const mockToken = "user token";

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
      jest.spyOn(jwt, "sign").mockResolvedValue(mockToken as never);

      const expected: any = await sut(email, password);

      expect(expected).toBe(mockToken);
    })

    it("Should return error in catch {}", async () => {
      const error = new Error("Error occured");

      prismaMock.user.findUnique.mockRejectedValue(error);

      const expected: any  = await sut(email, password);

      expect(expected.toString()).toBe("Error: Error occured");
    });

  });
});
