import * as SongsRouter from "./songs";
import * as AlbumsRouter from "./albums";
import * as UsersRouter from "./users";
import * as AuthenticationsRouter from "./authentications";
import * as PlaylistsRouter from "./playlists";
import * as CollaborationsRouter from "./collaborations";

export const router = {
  ...SongsRouter,
  ...AlbumsRouter,
  ...UsersRouter,
  ...AuthenticationsRouter,
  ...PlaylistsRouter,
  ...CollaborationsRouter
};
