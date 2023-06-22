import * as AlbumsRouter from "./albums";
import * as AuthenticationsRouter from "./authentications";
import * as CollaborationsRouter from "./collaborations";
import * as PlaylistsRouter from "./playlists";
import * as SongsRouter from "./songs";
import * as UsersRouter from "./users";
import * as ExportRouter from "./export";

export const router = {
  ...SongsRouter,
  ...AlbumsRouter,
  ...UsersRouter,
  ...AuthenticationsRouter,
  ...PlaylistsRouter,
  ...CollaborationsRouter,
  ...ExportRouter
};
