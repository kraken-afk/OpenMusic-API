import * as SongsRouter from "./songs";
import * as AlbumsRouter from "./albums";
import * as UsersRouter from "./users";

export const router = { ...SongsRouter, ...AlbumsRouter, ...UsersRouter };
