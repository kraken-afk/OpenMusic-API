import * as Hapi from "@hapi/hapi";
import AlbumsRouter from "./routes/albums";

async function init() {
  const port = 5000;
  const host = "127.0.0.1";
  const server = Hapi.server({
    port,
    host,
  });

  server.route(AlbumsRouter.get);
  server.route(AlbumsRouter.create);
  server.route(AlbumsRouter.update);
  server.route(AlbumsRouter.delete);

  await server.start();
  console.log(`Server running on %s`, server.info.uri);
}

init();
