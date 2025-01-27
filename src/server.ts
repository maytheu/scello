import "dotenv/config";
import { createServer } from "http";
import { PrismaClient } from "@prisma/client";

import { env } from "./config/validate";
import App from "./App";

const port = env.PORT;
const httpApp = App.app;

const httpServer = createServer(httpApp);

export const prisma = new PrismaClient();

httpServer.listen(port, () => console.log(`Server started on port ${port}`));
 