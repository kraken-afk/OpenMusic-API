import { errors } from "./registerErrors";

type ServerResponse<T extends Object> = {
  status: "success" | "fail";
  code: number;
  data?: T;
  message?: string;
};

export function routeErrorHandler<
  T extends Error & { code: number },
  K extends Object
>(error: T, data?: K) {
  let response: ServerResponse<K>;
  if (errors.some((e) => error instanceof e))
    response = {
      status: "fail",
      code: error.code,
      message: error.message,
    };
  else
    response = {
      status: "fail",
      code: 500,
      message: "Internal Server Error",
    };

  return response;
}
