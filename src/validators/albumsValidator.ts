import type { Album, AlbumsCreation, ServerResponse } from "../type";
import { type Request, type ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";

type AlbumsResponse = ServerResponse<{ albumId: string } | { album: Album }>;

export default function validateAlbumCreation(req: Request, h: ResponseToolkit) {
  const payload = req.payload as AlbumsCreation;
  const albumsSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    year: Joi.number().integer().required(),
  });
  const { error } = albumsSchema.validate(payload, {
    abortEarly: false,
  });

  if (error == null) {
    return h.continue;
  } else {
    const { stringify: s } = JSON;
    const response: AlbumsResponse = {
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
