////////////////////////////////////////////
//             Albums Scope              //
//////////////////////////////////////////

export type AlbumsResponse = {
  status: 'success' | 'fail',
  code: number,
  data?: { albumId: string } | { album: Album },
  message?: string,
};

export type AlbumsCreation = {
  name: string,
  year: number,
};

export type Album = AlbumsCreation & { id: string, songs?: Array<object> | undefined }

export type DataAlbumCreated = { albumId: string };

////////////////////////////////////////////
//             Songs Scope               //
//////////////////////////////////////////

export type SongsCreation = {
  title: string,
  year: number,
  genre: string,
  performer: string,
  duration?: number,
  albumId?: string,
}

export type Song = {
  id?: string;
  title?: string;
  year?: number;
  performer?: string;
  genre?: string;
  duration?: number | null;
  albumId?: string | null;
};

export type SongsResponse = {
  status: "success" | "fail";
  code: number;
  data?: { songId: string } | { songs: any[] } | { song: any };
  message?: string;
};

////////////////////////////////////////////
//             Models Scope              //
//////////////////////////////////////////

export type DatabaseResponsePositive<T extends Object> = { status: true, data: T , message?: string};

export type DatabaseResponseNegative = { status: false, message: string, code?: number };

export type DatabaseResponse<T extends Object> = DatabaseResponsePositive<T> | DatabaseResponseNegative;