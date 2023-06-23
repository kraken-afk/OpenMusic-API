import { ResponseToolkit, ServerRoute, Request } from "@hapi/hapi";
import { join } from "path";

export const serveStaticFiles: ServerRoute = {
  path: "/uploads/{param*}",
  method: "GET",
  handler: (req: Request, h: ResponseToolkit) =>
    h.file(join(__dirname, `./../uploads/${req.params.param}`)),
};
