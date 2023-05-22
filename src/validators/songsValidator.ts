import { Request, ResponseToolkit } from "@hapi/hapi";
import { SongsCreation, SongsResponse } from "../app.d";

export default function validateSongsCreation(
  req: Request,
  h: ResponseToolkit
) {
  const song = req.payload as SongsCreation;
  const requiredParameter = {
    title: "string",
    year: "number",
    genre: "string",
    performer: "string",
  };

  if (
    Object.entries(requiredParameter).every(([param, type]) => {
      return (param in song && typeof song[param] === type);
    })
  )
    return h.continue;
  else {
    const { stringify: s } = JSON;
    const response: SongsResponse = {
      status: "fail",
      code: 400,
      message:
        "Invalid request body.",
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
