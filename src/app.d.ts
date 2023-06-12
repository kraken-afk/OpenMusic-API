export type ServerResponse<T extends Object> = {
  status: "success" | "fail";
  code: number;
  data?: T;
  message?: string;
};

////////////////////////////////////////////
//             Albums Scope              //
//////////////////////////////////////////

export type AlbumsCreation = {
  name: string;
  year: number;
};

export type Album = AlbumsCreation & {
  id: string;
  songs?: Array<object> | undefined;
};

export type DataAlbumCreated = { albumId: string };

////////////////////////////////////////////
//             Songs Scope               //
//////////////////////////////////////////

export type SongsCreation = {
  title: string;
  year: number;
  genre: string;
  performer: string;
  duration?: number;
  albumId?: string;
};

export type Song = {
  id?: string;
  title?: string;
  year?: number;
  performer?: string;
  genre?: string;
  duration?: number | null;
  albumId?: string | null;
};

////////////////////////////////////////////
//             Users Scope               //
//////////////////////////////////////////

export type UserCreation = {
  username: string;
  fullname: string;
  password: string;
};

export type UserAuth = {
  username: string;
  password: string;
};

////////////////////////////////////////////
//           Authentication Scope        //
//////////////////////////////////////////

export type RefreshTokenPayload = {
  refreshToken: string | Buffer;
};

////////////////////////////////////////////
//             Playlists Scope           //
//////////////////////////////////////////

export type PlaylistCreation = { name: string; owner: string };

export type Playlist = {
  id: string;
  name: string;
  username: string;
};

////////////////////////////////////////////
//         Collaborations Scope          //
//////////////////////////////////////////

export type CollaborationCreationPayload = {
  playlistId: string;
  userId: string;
};

////////////////////////////////////////////
//             Models Scope              //
//////////////////////////////////////////

export type DatabaseResponsePositive<T extends Object> = {
  status: true;
  code?: number;
  data: T;
  message?: string;
};

export type DatabaseResponseNegative = {
  status: false;
  message: string;
  code?: number;
};

export type DatabaseResponse<T extends Object> =
  | DatabaseResponsePositive<T>
  | DatabaseResponseNegative;
