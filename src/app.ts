import * as Hapi from "@hapi/hapi";
import { router } from "./routes";

async function init() {
  const port = 5000;
  const host = "127.0.0.1";
  const server = Hapi.server({
    port,
    host,
  });

  server.route(Object.values(router));

  await server.start();
  console.log(`Server running on %s`, server.info.uri);
}

init();
