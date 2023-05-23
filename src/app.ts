import * as Hapi from "@hapi/hapi";
import { router } from "./routes";
import process from "node:process";

async function init() {
  (require('dotenv')).config();
  const host = process.env?.HOST ?? "127.0.0.1";
  const port = process.env?.PORT ? parseInt(process.env.PORT) : 5000;
  const server = Hapi.server({ host, port });

  server.route(Object.values(router));

  await server.start();
  console.log(`Server running on %s`, server.info.uri);
}

init();
