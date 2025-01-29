/**
 * @author @maytheu
 * Ensure all environment varaibles are available in the env file
 */

import { cleanEnv, num, str } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: num(),
  SECRET_KEY: str(),
});
