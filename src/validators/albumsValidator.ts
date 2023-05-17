import { Request, ResponseToolkit } from "@hapi/hapi";
import type { AlbumsCreation, AlbumsResponse } from "../app.d";

export default function validateAlbumCreation(
  req: Request,
  h: ResponseToolkit
) {
  const payload = req.payload as AlbumsCreation;

  if (
    "name" in payload &&
    "year" in payload &&
    typeof payload.name === "string" &&
    typeof payload.year === "number"
  )
    return h.continue;
  else {
    const { stringify: s } = JSON;
    const response: AlbumsResponse = {
      status: "fail",
      code: 400,
      message:
        "Invalid request body. Name<string> and Year<number> are required.",
    };

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header(
      "Content-Length",
      String(Buffer.byteLength(s(response), "utf-8"))
    );
    req.app = { invalidResponse: res };
    return res;
  }
}
