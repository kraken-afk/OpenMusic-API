import * as AlbumsRouter from "./albums";
import * as AuthenticationsRouter from "./authentications";
import * as CollaborationsRouter from "./collaborations";
import * as PlaylistsRouter from "./playlists";
import * as SongsRouter from "./songs";
import * as UsersRouter from "./users";
import * as ExportRouter from "./export";
import * as UploadsRouter from "./uploads";

export const router = {
  ...AlbumsRouter,
  ...SongsRouter,
  ...UsersRouter,
  ...AuthenticationsRouter,
  ...PlaylistsRouter,
  ...CollaborationsRouter,
  ...ExportRouter,
  ...UploadsRouter,
};
