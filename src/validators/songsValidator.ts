import { type ServerResponse, type SongsCreation } from "../app.d";
import { type Request, type ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";

type SongsResponse = ServerResponse<
  { songId: string } | { songs: any[] } | { song: any }
>;

export default function validateSongsCreation(req: Request, h: ResponseToolkit) {
  const song = req.payload as SongsCreation;
  const songScheme = Joi.object({
    title: Joi.string().max(255).required(),
    year: Joi.number().integer().required(),
    genre: Joi.string().max(255).required(),
    performer: Joi.string().max(255).required(),
    duration: Joi.number().optional(),
    albumId: Joi.string().max(255).optional(),
  });
  const { error } = songScheme.validate(song, { abortEarly: false });

  if (error == null) {
    return h.continue;
  } else {
    const { stringify: s } = JSON;
    const response: SongsResponse = {
      status: "fail",
      code: 400,
      message: error.details.map(({ message }) => message).join(", "),
    };

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header("Content-Length", String(Buffer.byteLength(s(response), "utf-8")));
    req.app = { invalidResponse: res };
    return res;
  }
}
