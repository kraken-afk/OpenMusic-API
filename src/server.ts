import { databaseSync } from "./config/init";
import { router } from "./routes";
import * as Hapi from "@hapi/hapi";
import * as Jwt from "@hapi/jwt";
import * as Inert from "@hapi/inert"
import { config } from "dotenv";
import process from "node:process";

config();

async function init() {
  const host = process.env?.HOST ?? "127.0.0.1";
  const port = process.env?.PORT ? parseInt(process.env.PORT) : 5000;
  const server = Hapi.server({ host, port });

  await databaseSync();
  await server.register([{ plugin: Jwt }, { plugin: Inert }]);

  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 1800,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  server.route(Object.values(router));

  await server.start();
  console.log("\nServer running on %s", server.info.uri);
}

init();
