import { email } from "envalid";
import { z } from "zod";

const LoginDTO = z
  .object({
    email: z.string().email({ message: "Email is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be equal or greater than 6" }),
  })
  .strict();

const IName = z.object({
  name: z.string({ invalid_type_error: "name is required" }),
});

const SignupDTO = LoginDTO.merge(IName);




type ILogin = z.infer<typeof LoginDTO>;
type ISignup = z.infer<typeof SignupDTO>;
type IName = z.infer<typeof IName>;

export {
  ILogin,
  ISignup,
  IName,
  LoginDTO,
  SignupDTO,
};
