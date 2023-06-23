import type { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";

export function coverUploadsValidator(req: Request, h: ResponseToolkit) {
  const contectTypeValidator = Joi.object({
    "content-type": Joi.string().valid(
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp",
      "multipart/form-data",
    ),
  }).unknown();

  // @ts-ignore
  const { error } = contectTypeValidator.validate(req.payload?.cover?.hapi?.headers);

  if (error == null) return h.continue;
  else {
    const { stringify: s } = JSON;
    const response = {
      status: "fail",
      code: 400,
      message: "Invalid Content-Type",
    };

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header("Content-Length", String(Buffer.byteLength(s(response), "utf-8")));
    req.app = { invalidResponse: res };
    return res;
  }
}
